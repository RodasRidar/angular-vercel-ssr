import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  businessName = '';
  constructor(private readonly clientService: ClientService) {}

  ngOnInit(): void {
    this.clientService.getClient().subscribe((client) => {
      if (client) {
        this.businessName = client.companyName || '';
      }
    });
  }
  get year() {
    return new Date().getFullYear();
  }
}
