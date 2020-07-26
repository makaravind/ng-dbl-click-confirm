# ng-dbl-click-confirm
A prototype implementation of double click confirmation in Angular using RxJS. This is a rough implementation to understand the benefits of double click to confirm rather than a confirmation dialog.

In this blog post I mentioned why I feel confirmation dialogs are bad UX and more details on new implementation.
https://maravindblog.wordpress.com/2020/07/26/ux-case-study-confirmation-dialogs/

## Use

```
        <app-dbl-click-confirmation (onConfirm)="onDblClickConfirmed()">
          <a>
            Archive
          </a>
          <div poppver>Assets archived cannot be revoked!</div>
        </app-dbl-click-confirmation>

```
