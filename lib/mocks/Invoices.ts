import { IInvoice } from '@/lib/interfaces'

const mockInvoices: IInvoice[] = [
  {
    id: '1',
    costumer: {
      id: '1costumer',
      name: 'JPeças',
      contactData: { name: 'joão', phone: 12988998899, isWhatsapp: true },
      locationData: {
        street: 'Rua Savério Mario Ardito',
        number: 30,
        neighbourhood: 'Parque São Cristóvão',
        city: 'Taubaté',
        CEP: 12012345
      }
    },
    products: [
      {
        product: {
          id: '1p',
          name: 'product1',
          price: 10,
          validityMonths: 6,
          category: {
            id: '1',
            name: 'extintor'
          }
        },
        quantity: 2
      },
      {
        product: {
          id: '2p',
          name: 'product2',
          price: 10,
          validityMonths: 12,
          category: {
            id: '1',
            name: 'extintor'
          }
        },
        quantity: 3
      }
    ],
    totalValue: 60,
    visitDate: '24/10/2024',
    returnDate: '01/11/2025'
  },
  {
    id: '2',
    costumer: {
      id: '1costumer',
      name: 'JPeças',
      contactData: { name: 'joão', phone: 12988998899, isWhatsapp: true },
      locationData: {
        street: 'rua 1',
        number: 10,
        neighbourhood: 'bairro 1',
        city: 'cidade',
        CEP: 12012345
      }
    },
    products: [
      {
        product: {
          id: '1p',
          name: 'product1',
          price: 10,
          validityMonths: 6,
          category: {
            id: '1',
            name: 'extintor'
          }
        },
        quantity: 2
      },
      {
        product: {
          id: '2p',
          name: 'product2',
          price: 10,
          validityMonths: 12,
          category: {
            id: '1',
            name: 'extintor'
          }
        },
        quantity: 3
      }
    ],
    totalValue: 60,
    visitDate: '24/10/2024',
    returnDate: '01/11/2025'
  },
  {
    id: '3',
    costumer: {
      id: '1costumer',
      name: 'JPeças',
      contactData: { name: 'joão', phone: 12988998899, isWhatsapp: true },
      locationData: {
        street: 'rua 1',
        number: 10,
        neighbourhood: 'bairro 1',
        city: 'cidade',
        CEP: 12012345
      }
    },
    products: [
      {
        product: {
          id: '1p',
          name: 'product1',
          price: 10,
          validityMonths: 6,
          category: {
            id: '1',
            name: 'extintor'
          }
        },
        quantity: 2
      },
      {
        product: {
          id: '2p',
          name: 'product2',
          price: 10,
          validityMonths: 12,
          category: {
            id: '1',
            name: 'extintor'
          }
        },
        quantity: 3
      }
    ],
    totalValue: 60,
    visitDate: '24/10/2024',
    returnDate: '01/11/2025'
  },
  {
    id: '4',
    costumer: {
      id: '1costumer',
      name: 'JPeças',
      contactData: { name: 'joão', phone: 12988998899, isWhatsapp: true },
      locationData: {
        street: 'Rua Geraldo Marcelino Bispo',
        number: 300,
        neighbourhood: 'bairro 1',
        city: 'cidade',
        CEP: 12012345
      }
    },
    products: [
      {
        product: {
          id: '1p',
          name: 'product1',
          price: 10,
          validityMonths: 6,
          category: {
            id: '1',
            name: 'extintor'
          }
        },
        quantity: 2
      },
      {
        product: {
          id: '2p',
          name: 'product2',
          price: 10,
          validityMonths: 12,
          category: {
            id: '1',
            name: 'extintor'
          }
        },
        quantity: 3
      }
    ],
    totalValue: 60,
    visitDate: '24/10/2024',
    returnDate: '01/11/2025'
  }
]

export default mockInvoices
