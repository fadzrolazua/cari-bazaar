import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  template: `
    <div class="loading-state" role="status" aria-live="polite">
      <span class="loading-state__spinner" aria-hidden="true"></span>
      <span>{{ message() }}</span>
    </div>
  `,
  styles: `
    .loading-state {
      align-items: center;
      color: #64748b;
      display: flex;
      font-size: 0.9rem;
      gap: 0.65rem;
      justify-content: center;
      min-height: 12rem;
      padding: 2rem;
    }

    .loading-state__spinner {
      animation: spin 700ms linear infinite;
      border: 2px solid #e2e8f0;
      border-radius: 50%;
      border-top-color: #ef6c4d;
      height: 1rem;
      width: 1rem;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingStateComponent {
  readonly message = input('Loading bazaars…');
}
