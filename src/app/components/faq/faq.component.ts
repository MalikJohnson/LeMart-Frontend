import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent {
  searchQuery = '';
  faqs = [
    {
      id: 1,
      category: 'General',
      question: 'What is Le Mart?',
      answer: 'Le Mart is a people-first retailer offering unbeatable prices on everything from groceries to electronics.'
    },
    {
      id: 2,
      category: 'Returns',
      question: 'What is your return policy?',
      answer: 'Most items can be returned within 90 days. Le Mart brand items have a 1-year return window with receipt.'
    },
    {
      id: 3,
      category: 'Shipping',
      question: 'How long does shipping take?',
      answer: 'Standard shipping typically takes 5-7 business days. Expedited options are available at checkout.'
    },
    {
      id: 4,
      category: 'Account',
      question: 'How do I reset my password?',
      answer: 'Click on "Forgot Password" on the login page and follow the instructions to reset your password.'
    },
    {
      id: 5,
      category: 'Payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and Le Mart gift cards.'
    }
  ];
  filteredFAQs = this.faqs;

  filterFAQs(): void {
    if (!this.searchQuery) {
      this.filteredFAQs = this.faqs;
    } else {
      this.filteredFAQs = this.faqs.filter(faq =>
        faq.question.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }
}