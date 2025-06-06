document.addEventListener('DOMContentLoaded', () => {
  const storiesContainer = document.getElementById('stories-container');
  
  const aboutBtn = document.getElementById('about-btn');
  const aboutModal = document.getElementById('about-modal');
  const aboutModalText = document.getElementById('about-modal-text');
  const aboutCloseButton = aboutModal ? aboutModal.querySelector('.close-button') : null;

  let allStoriesData = [];

  if (!storiesContainer) {
    console.error("Error: Could not find HTML element with ID 'stories-container'. Please ensure your HTML file contains <div id='stories-container'>.");
    return;
  }
  
  fetch('FairytalesData.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(allStoriesArrayRaw => {
     
      allStoriesData = allStoriesArrayRaw.map((story, index) => ({
        ...story, 
        number: index + 1 
      }));

      const tableOfContentsDiv = document.createElement('div');
      tableOfContentsDiv.id = 'story-table-of-contents';

      allStoriesData.forEach(storyData => {
        const listItem = createStoryListItemHtml(storyData); 
        tableOfContentsDiv.appendChild(listItem);
      });
      storiesContainer.prepend(tableOfContentsDiv);

      const spanishStoriesLink = document.getElementById('spanish-stories-link');
      if (spanishStoriesLink && allStoriesData) { 
          const firstSpanishStory = allStoriesData.find(story => story.language === 'Spanish');

          if (firstSpanishStory) {
              spanishStoriesLink.href = `#story-toc-${firstSpanishStory.number}`; 
              spanishStoriesLink.style.display = 'inline-block';
          } else {
              spanishStoriesLink.style.display = 'none';
          }
      }
      
      allStoriesData.forEach(storyData => {
        
        const storyWrapper = document.createElement('div');
        storyWrapper.id = `story-${storyData.number}`; 
        const storyElement = createStoryHtml(storyData);
        storyWrapper.appendChild(storyElement);

        const backToListLink = document.createElement('a');
        backToListLink.href = '#story-table-of-contents';
        backToListLink.classList.add('back-to-top-btn');
        backToListLink.textContent = 'Back to Story List';
        storyWrapper.appendChild(backToListLink);

        storiesContainer.appendChild(storyWrapper);
      });

    })
    .catch(error => {
      console.error('Error fetching story data:', error);
      if (storiesContainer) {
        const errorDiv = document.createElement('div');
        errorDiv.textContent = 'Could not load stories. Please check the console for more details.';
        errorDiv.style.color = 'red';
        storiesContainer.appendChild(errorDiv);
      } else {
         console.error('Cannot display error message: storiesContainer not found.');
      }
    });


  function createStoryListItemHtml(story) {
    const listItem = document.createElement('a');
    listItem.href = `#story-${story.number}`; 
    listItem.id = `story-toc-${story.number}`;
    listItem.classList.add('story-list-item');

    const foreignTitle = document.createElement('h3');
    foreignTitle.textContent = story.foreignTitle;
    listItem.appendChild(foreignTitle);

    const illustrationImg = document.createElement('img');
    illustrationImg.src = story.illustrationUrl;
    illustrationImg.alt = story.illustrationAlt;
    illustrationImg.classList.add('list-illustration-preview');
    listItem.appendChild(illustrationImg);

    const englishTitle = document.createElement('p');
    englishTitle.textContent = story.englishTitle;
    listItem.appendChild(englishTitle);

    return listItem;
  }

  if (aboutBtn && aboutModal && aboutModalText && aboutCloseButton) {
    aboutBtn.addEventListener('click', () => {
      aboutModalText.innerHTML = `<h2>About This Page</h2>
      <p>Welcome! This website is a personal project I created to host parallel-text fairytales. As I learn new languages, I find reading stories side-by-side helpful and exciting. It’s like deciphering a code that leads to magic. That’s why I wanted to create a place to keep such texts.</p>
      <p>Initially, I searched for stories that felt like fairytales but were not overly simplistic. The search had tired me but led to nothing. So I started making my own magical stories.</p>
      <p>I create English versions first, then ask AI to tell them back to me in Greek or Spanish. I also use AI to illustrate them.</p>
      <p>I built this site using HTML, CSS, and JavaScript, combining my passion for language learning with web development practice. If you're also a language learner, I hope you find these stories useful and enjoyable. Happy reading!</p>
      <p style="font-size:0.9em; color:#666;">
      </p>
      `;
      aboutModal.classList.remove('hidden');
      aboutModal.classList.add('active');
    });

    aboutCloseButton.addEventListener('click', () => {
      aboutModal.classList.remove('active');
      aboutModal.classList.add('hidden');
    });

    aboutModal.addEventListener('click', (event) => {
      if (event.target === aboutModal) {
        aboutModal.classList.remove('active');
        aboutModal.classList.add('hidden');
      }
    });
  }

  function createStoryHtml(story) {
    const storyContentFragment = document.createDocumentFragment();

    const numberDiv = document.createElement('div');
    numberDiv.classList.add('number');
    numberDiv.innerHTML = `<h3>${story.number}</h3>`; 
    storyContentFragment.appendChild(numberDiv);

    const storyPairContainer = document.createElement ('div');
    storyPairContainer.classList.add('story-pair-container');
    
    const foreignUnitDiv = document.createElement('div');
    foreignUnitDiv.classList.add('foreign-unit');

    const foreignStoryTextDiv = document.createElement('div');
    foreignStoryTextDiv.classList.add('story-text');

    const foreignCombinedHtml = `
    <div class="story-title"><h2>${story.foreignTitle}</h2></div>
    ${story.foreignText}
    `
    foreignStoryTextDiv.innerHTML = foreignCombinedHtml;
    foreignUnitDiv.appendChild(foreignStoryTextDiv);

    const vocabDiv = document.createElement('div');
    vocabDiv.classList.add('vocab');
    vocabDiv.innerHTML = `<div class="story-title"><p>Vocabulary</p></div><div></div>`;
    const vocabContentDiv = vocabDiv.querySelector('div + div');

    story.vocabulary.forEach(item => {
      const p = document.createElement('p');
      p.textContent = `${item.word} - ${item.translation}`;
      vocabContentDiv.appendChild(p);
    });

    foreignUnitDiv.appendChild(vocabDiv);

    const englishUnitDiv = document.createElement('div');
    englishUnitDiv.classList.add('english-unit');
    const englishStoryTextDiv = document.createElement('div');
    englishStoryTextDiv.classList.add('story-text');

    const englishCombinedHtml = `
    <div class="story-title"><h2>${story.englishTitle}</h2></div>
    ${story.englishText}
    `
    englishStoryTextDiv.innerHTML = englishCombinedHtml;
    englishUnitDiv.appendChild(englishStoryTextDiv);

    const illustrationDiv = document.createElement('div');
    illustrationDiv.classList.add('illustration-div');

    const illustrationImg = document.createElement('img');
    illustrationImg.classList.add('illustration');
    illustrationImg.src = story.illustrationUrl;
    illustrationImg.alt = story.illustrationAlt;

    illustrationDiv.appendChild(illustrationImg);

    englishUnitDiv.appendChild(illustrationDiv);
    
    storyPairContainer.appendChild(foreignUnitDiv);
    storyPairContainer.appendChild(englishUnitDiv);

    storyContentFragment.appendChild(storyPairContainer);

    return storyContentFragment;
  }
});