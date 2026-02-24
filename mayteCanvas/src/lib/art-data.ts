export interface Painting {
  id: string;
  slug: string;
  name: string;
  artist: string;
  description: string;
  price: number;
  imageUrl: string;
  imageHint: string;
  year: number;
}

export const paintings: Painting[] = [
  { id: '1', slug: 'sol-andino', name: 'hanayi', artist: 'Pintor Anónimo', year: 2021, description: 'Una representación vibrante del sol como deidad central en la cosmología andina, utilizando pigmentos naturales sobre lienzo.', price: 1200, imageUrl: '../media/hanayi.jpg', imageHint: 'indigenous painting' },
  { id: '2', slug: 'mujer-otavalena', name: 'Mujer Otavaleña', artist: 'María F. Endara', year: 2022, description: 'Retrato detallado de una mujer de Otavalo, destacando la riqueza de su vestimenta y la serenidad de su expresión.', price: 1850, imageUrl: './media/hashoto.jpg', imageHint: 'ecuadorian woman' },
  { id: '3', slug: 'susurro-de-los-andes', name: 'Susurro de los Andes', artist: 'Carlos Jacanamijoy', year: 2020, description: 'Obra abstracta que evoca los contornos y colores de la cordillera andina al amanecer.', price: 2500, imageUrl: 'C:\Users\eflowers\.vscode\mayteCanvas\src\lib\media\hapa.jpg', imageHint: 'andean mountains' },
  { id: '4', slug: 'mercado-de-colores', name: 'Mercado de Colores', artist: 'Elena Pallo', year: 2023, description: 'Escena costumbrista que captura la energía y el colorido de un mercado indígena tradicional.', price: 950, imageUrl: 'src\lib\media\hitachepto.jpg', imageHint: 'local market' },
  { id: '5', slug: 'guardian-de-lana', name: 'Guardián de Lana', artist: 'José Perugachi', year: 2022, description: 'Una llama solitaria se recorta contra el paisaje montañoso, simbolizando la resistencia y la conexión con la tierra.', price: 1500, imageUrl: 'https://picsum.photos/seed/5/600/800', imageHint: 'llama landscape' },
  { id: '6', slug: 'tejido-cosmico', name: 'Tejido Cósmico', artist: 'Colectivo Kawsay', year: 2023, description: 'Inspirado en los patrones textiles de la cultura Cañari, esta pieza explora la dualidad y el equilibrio del universo.', price: 2100, imageUrl: 'https://picsum.photos/seed/6/600/800', imageHint: 'textile pattern' },
  { id: '7', slug: 'danza-del-inti-raymi', name: 'Danza del Inti Raymi', artist: 'Luis A. Guamán', year: 2019, description: 'Pintura dinámica que celebra la Fiesta del Sol, llena de movimiento y fervor comunitario.', price: 1700, imageUrl: 'https://picsum.photos/seed/7/600/800', imageHint: 'ceremonial dance' },
  { id: '8', slug: 'corazon-de-pachamama', name: 'Corazón de Pachamama', artist: 'Rosa Tenezaca', year: 2022, description: 'Una visión simbólica de la Madre Tierra, fusionando elementos humanos y naturales en una composición onírica.', price: 3200, imageUrl: 'https://picsum.photos/seed/8/600/800', imageHint: 'pachamama art' },
];
