import { Component } from '@angular/core';
import { Bazaar } from '../../core/models/bazaar.model';
import { BazaarService } from '../../core/services/bazaar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bazaar-list',
  imports: [CommonModule],
  templateUrl: './bazaar-list.html',
  styleUrl: './bazaar-list.scss',
})
export class BazaarListComponent {
  // -------------------
  // Properties
  // -------------------
  bazaars: Bazaar[] = [];

  constructor(private bazaarService: BazaarService) {}

  // -------------------
  // Lifecycle Hooks
  // -------------------
  ngOnInit(): void {
    this.loadBazaars();
  }

  // -------------------
  // Methods
  // -------------------
  private loadBazaars(): void {
    this.bazaarService.getBazaars().subscribe((result) => {
      this.bazaars = result.filter((b) => b.isActive);
    });
  }
}
