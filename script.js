document.addEventListener('DOMContentLoaded', function () {

    // Feedback form and star rating
    const feedbackForm = document.getElementById('feedbackForm');
    const feedbackNameInput = document.getElementById('feedbackName');
    const feedbackEmailInput = document.getElementById('feedbackEmail');
    const feedbackMessageInput = document.getElementById('feedbackMessage');
    const feedbackRatingStars = document.querySelectorAll('#feedbackRatingStars button');
    const feedbackList = document.getElementById('feedbackList');
    const averageRatingValue = document.getElementById('averageRatingValue');
    const averageRatingStars = document.getElementById('averageRatingStars');
    const averageRatingCount = document.getElementById('averageRatingCount');

    const feedbackEntries = JSON.parse(localStorage.getItem('gymFeedbacks')) || [];
    let selectedRating = 0;

    function setRating(rating) {
        selectedRating = rating;
        feedbackRatingStars.forEach(star => {
            const value = Number(star.dataset.value);
            star.classList.toggle('active', value <= rating);
        });
    }

    function renderAverageRating() {
        if (!feedbackEntries.length) {
            averageRatingValue.textContent = '0.0';
            averageRatingCount.textContent = 'No reviews yet';
            return;
        }

        const total = feedbackEntries.reduce((s, i) => s + i.rating, 0);
        averageRatingValue.textContent = (total / feedbackEntries.length).toFixed(1);
        averageRatingCount.textContent = `Based on ${feedbackEntries.length} reviews`;
    }

    function renderFeedbackList() {
        feedbackList.innerHTML = '';

        if (!feedbackEntries.length) {
            feedbackList.innerHTML = '<p class="feedback-empty">No feedback yet.</p>';
            return;
        }

        feedbackEntries.forEach(entry => {
            const div = document.createElement('div');
            div.className = 'feedback-item';
            div.innerHTML = `
                <p class="feedback-item-name">${entry.name}</p>
                <p class="feedback-item-message">${entry.message}</p>
            `;
            feedbackList.appendChild(div);
        });
    }

    feedbackRatingStars.forEach(star => {
        star.addEventListener('click', () => {
            setRating(Number(star.dataset.value));
        });
    });

    renderAverageRating();
    renderFeedbackList();

    feedbackForm.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!selectedRating) {
            alert('Please select a rating');
            return;
        }

        feedbackEntries.push({
            name: feedbackNameInput.value,
            email: feedbackEmailInput.value,
            message: feedbackMessageInput.value,
            rating: selectedRating
        });

        localStorage.setItem('gymFeedbacks', JSON.stringify(feedbackEntries));

        feedbackForm.reset();
        setRating(0);
        renderFeedbackList();
        renderAverageRating();
    });

});
