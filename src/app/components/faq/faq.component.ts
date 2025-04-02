import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbAccordionModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent {
  searchQuery = '';
  selectedCategory: string | null = null;
  categories = ['General', 'Customers', 'Purpose', 'Suppliers'];
  faqs = [
    // General Questions
    {
      id: 1,
      category: 'General',
      question: 'What is Le Mart?',
      answer: 'Le Mart is a people-first retailer offering unbeatable prices on everything from groceries to electronics.'
    },
    {
      id: 2,
      category: 'General',
      question: "What are Le Mart's store hours?",
      answer: 'All Le Mart locations operate from Monday to Friday: 8AM–10PM and Saturday to Sunday: 8AM–11PM. You can find your nearest store using our store locator tool on our website.'
    },
    {
      id: 3,
      category: 'General',
      question: 'In which countries does Le Mart operate?',
      answer: 'Today, Le Mart operates more than 10,500 stores and clubs in 19 countries and eCommerce websites.'
    },
    {
      id: 4,
      category: 'General',
      question: 'How many people work at Le Mart?',
      answer: 'As of the end of FY2024, Le Mart employed approximately 2.1 million associates worldwide, with approximately 1.6 million associates in the U.S.'
    },

    // Customer Questions
    {
      id: 5,
      category: 'Customers',
      question: 'What if I have a question about customer support?',
      answer: 'Contact our Customer Service team to provide a comment or ask a question about your local store or our corporate headquarters.'
    },
    {
      id: 6,
      category: 'Customers',
      question: 'Do I have to use self-checkout?',
      answer: 'If you prefer checking out with a cashier, we will continue to have that option available for customers who prefer that method.'
    },
    {
      id: 7,
      category: 'Customers',
      question: 'Does Le Mart allow animals in its stores?',
      answer: 'Le Mart welcomes service animals as defined by the ADA in our stores.'
    },
    {
      id: 8,
      category: 'Customers',
      question: 'Can I film inside a Le Mart store?',
      answer: 'Unauthorized filming is prohibited and we reserve the right to enforce that policy.'
    },
    {
      id: 9,
      category: 'Customers',
      question: 'What is your return policy?',
      answer: 'Most items can be returned within 90 days. Le Mart brand items have a 1-year return window with receipt.'
    },
    {
      id: 10,
      category: 'Customers',
      question: 'How long does shipping take for orders?',
      answer: 'Standard shipping typically takes 5-7 business days. Expedited options are available at checkout.'
    },

    // Purpose Questions
    {
      id: 11,
      category: 'Purpose',
      question: 'What does Le Mart do for local communities?',
      answer: 'Over the years, Le Mart has been intentional about leveraging our strengths, associates and other resources to build resiliency in communities.'
    },
    {
      id: 12,
      category: 'Purpose',
      question: 'How much do Le Mart associates make?',
      answer: 'We are continuously investing in higher wages, and the average hourly wage for our U.S. frontline associates is close to $18.'
    },
    {
      id: 13,
      category: 'Purpose',
      question: 'What is Le Mart doing about hunger?',
      answer: 'Serving communities lies at the heart of our mission to save people money and help them live better by providing convenient access to affordable food.'
    },
    {
      id: 14,
      category: 'Purpose',
      question: 'What is Le Mart doing to minimize packaging waste?',
      answer: 'Our ambition is to accelerate a transition to 100% reusable, recyclable, or industrially compostable packaging.'
    },
    {
      id: 15,
      category: 'Purpose',
      question: 'What is Le Mart doing about plastic waste?',
      answer: "We're exploring ways to design packaging with recyclability in mind, while reducing the amount of plastic used in our operations."
    },

    // Supplier Questions
    {
      id: 16,
      category: 'Suppliers',
      question: 'Where in the world does Le Mart source its products?',
      answer: 'Most of the products we source for our retail businesses in the U.S. and other major markets were made, grown or assembled domestically.'
    },
    {
      id: 17,
      category: 'Suppliers',
      question: 'What payment methods do you accept from suppliers?',
      answer: 'We accept all major credit cards, bank transfers, and Le Mart procurement cards.'
    }
  ];
  filteredFAQs = this.faqs;

  filterFAQs(): void {
    this.filteredFAQs = this.faqs.filter(faq => {
      const matchesSearch = !this.searchQuery || 
        faq.question.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesCategory = !this.selectedCategory || 
        faq.category === this.selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }

  selectCategory(category: string | null): void {
    this.selectedCategory = category;
    this.filterFAQs();
  }

  getCategoryCount(category: string): number {
    return this.faqs.filter(faq => faq.category === category).length;
  }
}