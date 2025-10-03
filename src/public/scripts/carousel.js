// //carousel.js
// console.log('carousel.js Loaded');

// export function renderCarousel() {
//   console.log('renderCarousel() called');
  
//   const carouselInner = document.getElementById('carousel-inner');
//   if (!carouselInner) {
//     console.warn('No carousel container found');
//     return;
//   }

//   carouselInner.innerHTML = '';
//   const latestArts = arts.slice(-5).reverse();

//   latestArts.forEach((art, idx) => {
//     console.log(`Rendering carousel item: ${art.title}`);
//     const item = document.createElement('div');
//     item.className = 'carousel-item' + (idx === 0 ? ' active' : '');
//     item.innerHTML = `
//       <img src="${art.image}" class="d-block w-100" alt="${art.title}">
//       <div class="carousel-caption d-none d-md-block">
//           <h5>${art.title}</h5>
//           <p>${art.description}</p>
//       </div>
//     `;
//     carouselInner.appendChild(item);
//   });

//   console.log('Carousel rendered with', latestArts.length, 'items');
// }
