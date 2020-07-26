import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {concat, of, Subject, timer} from 'rxjs';
import {exhaustMap, filter, mapTo, repeat, take, tap} from 'rxjs/internal/operators';
import Popper from 'popper.js';

/*@Directive({
  selector: '[appDblClickConfirmation]'
})*/
@Component({
  selector: 'app-dbl-click-confirmation',
  templateUrl: './click.html',
  styleUrls: ['./click.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DblClickConfirmationComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  constructor(private el: ElementRef, private zone: NgZone) {
  }

  @Input() message = 'Confirm';
  @Output() onConfirm = new EventEmitter();

  @Input() show = false;
  @Input() closeButton = false;
  @Input() placement: Popper.Placement = 'top';
  @Input() positionFixed = false;
  @Input() eventsEnabled = true;
  @Input() modifiers: Popper.Modifiers;

  @Output() close = new EventEmitter<void>();

  private popper: Popper;

  private obs = new Subject();
  public obs$ = this.obs.asObservable();
  @ViewChild('tooltip') tooltip;

  @HostListener('click', ['$event'])
  onMouseEnter(event) {
    this.obs.next(event);
  }

  applyGreenStyl() {
    this.el.nativeElement.style.border = '2px solid green';
  }

  applyOrangeStyle() {
    this.el.nativeElement.style.border = '2px solid orange';
  }

  applyRedStyle() {
    this.el.nativeElement.style.border = '2px solid red';
  }

  applyResetStyle() {
    this.el.nativeElement.style.border = null;
  }

  resetTimer() {
    return timer(5000).pipe(
      tap(() => this.applyResetStyle()),
      mapTo(true)
    );
  }

  ngOnInit(): void {
    const firstClick$ = this.obs$.pipe(
      tap(() => this.applyGreenStyl()),
      exhaustMap(() => {
        return of(true);
      }),
      filter(v => v === true),
      tap(() => this.show = true),
      tap(() => this.applyOrangeStyle()),
      take(1),
    );
    const secondClick$ = this.obs$.pipe(
      tap(() => {
        this.applyRedStyle();
        this.onConfirm.emit(true);
      }),
      take(1)
    );
    concat(firstClick$, secondClick$).pipe(
      repeat()
    ).subscribe(c => console.log('final output:', c));
  }


  ngAfterViewInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.target && !changes.target.firstChange ||
      changes.placement && !changes.placement.firstChange ||
      changes.positionFixed && !changes.positionFixed.firstChange ||
      changes.eventsEnabled && !changes.eventsEnabled.firstChange
    ) {
      this.destroy();
      this.create();
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

  onClose() {
    this.show = false;
    this.close.emit();
  }

  create() {
    this.zone.runOutsideAngular(() => {
      const {placement, positionFixed, eventsEnabled, modifiers} = this;

      this.popper = new Popper(
        this.getTargetNode(),
        this.el.nativeElement.querySelector('.angular-popper'),
        {
          placement,
          positionFixed,
          eventsEnabled,
          modifiers
        }
      );
    });
  }

  destroy() {
    if (this.popper) {
      this.zone.runOutsideAngular(() => {
        this.popper.destroy();
      });

      this.popper = null;
    }
  }

  private getTargetNode(): Element {
    return this.el.nativeElement;
  }

}
