import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-bazaar-status-badge',
  standalone: true,
  template: `
    <span
      class="status-badge"
      [class.status-badge--open]="isOpen()"
      [class.status-badge--closed]="!isOpen()"
    >
      <span class="status-badge__dot" aria-hidden="true"></span>
      {{ isOpen() ? 'Open today' : 'Closed today' }}
    </span>
  `,
  styles: `
    :host {
      display: inline-flex;
    }

    .status-badge {
      align-items: center;
      border-radius: 999px;
      display: inline-flex;
      font-size: 0.64rem;
      font-weight: 700;
      gap: 0.3rem;
      letter-spacing: 0.01em;
      padding: 0.24rem 0.45rem;
      white-space: nowrap;
    }

    .status-badge--open {
      background: #dcfce7;
      color: #166534;
    }

    .status-badge--closed {
      background: #f1f5f9;
      color: #64748b;
    }

    .status-badge__dot {
      background: currentColor;
      border-radius: 50%;
      height: 0.35rem;
      width: 0.35rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BazaarStatusBadgeComponent {
  readonly isOpen = input.required<boolean>();
}
