import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-state" role="status">
      <div class="empty-state__icon" aria-hidden="true">⌕</div>
      <h3>{{ title() }}</h3>
      <p>{{ message() }}</p>
      @if (actionLabel()) {
        <button type="button" (click)="action.emit()">{{ actionLabel() }}</button>
      }
    </div>
  `,
  styles: `
    .empty-state {
      align-items: center;
      color: #64748b;
      display: flex;
      flex-direction: column;
      min-height: 12rem;
      justify-content: center;
      padding: 2rem 1rem;
      text-align: center;
    }

    .empty-state__icon {
      align-items: center;
      background: #fff1ed;
      border-radius: 50%;
      color: #ef6c4d;
      display: flex;
      font-size: 1.65rem;
      height: 2.75rem;
      justify-content: center;
      margin-bottom: 0.75rem;
      width: 2.75rem;
    }

    h3 {
      color: #0f172a;
      font-size: 0.98rem;
      margin: 0;
    }

    p {
      font-size: 0.84rem;
      line-height: 1.5;
      margin: 0.45rem 0 1rem;
      max-width: 18rem;
    }

    button {
      background: transparent;
      border: 0;
      color: #ef6c4d;
      cursor: pointer;
      font-size: 0.82rem;
      font-weight: 700;
      padding: 0.35rem 0.5rem;
    }

    button:focus-visible {
      outline: 3px solid rgba(239, 108, 77, 0.3);
      outline-offset: 2px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  readonly title = input('Nothing found');
  readonly message = input('Try changing your search or filters.');
  readonly actionLabel = input<string | null>(null);
  readonly action = output<void>();
}
