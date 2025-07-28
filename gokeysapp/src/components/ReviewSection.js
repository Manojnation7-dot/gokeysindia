'use client';
import { useEffect, useState } from 'react';
import { Star, Heart } from 'lucide-react';
import { getCSRFToken } from "@/lib/getCSRFToken";

const ReviewSection = ({ contentType, objectSlug }) => {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    travel_month: '',
    comment: '',
    title: '',
    rating: 4,
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedReviewImages, setSelectedReviewImages] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [nextPage, setNextPage] = useState(null);

const fetchReviews = async (url) => {
  try {
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();

      if (Array.isArray(data.results)) {
        // Paginated response
        setReviews((prev) => {
          const merged = [...prev, ...data.results];
          const unique = Array.from(new Map(merged.map(item => [item.id, item])).values());
          return unique;
        });
        setNextPage(data.next);
      } else if (Array.isArray(data)) {
        // Plain list response
        setReviews(data);
        setNextPage(null);
      } else {
        console.error('Unexpected response shape:', data);
      }

    } else {
      console.error('Failed to load reviews:', res.status, res.statusText);
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
};

// ✅ On mount, call it with the initial URL
useEffect(() => {
  const initialUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/${contentType}/${objectSlug}/reviews/`;
  fetchReviews(initialUrl);
}, [contentType, objectSlug]);


  // Handle input changes
  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file changes and generate previews
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (imagePreviews.length + files.length > 5) {
      alert('You can upload a maximum of 5 images');
      return;
    }
    setForm((prev) => ({ ...prev, images: files }));
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  // Remove image preview
  const removeImagePreview = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Handle rating
  const handleRating = (value) => {
    setForm((prev) => ({ ...prev, rating: value }));
  };

  // Handle like button (placeholder functionality)
  const handleLike = (reviewId) => {
    console.log(`Liked review ${reviewId}`);
    // Add API call or state update for likes if needed
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const formData = new FormData();
  formData.append('name', form.name || 'Anonymous');
  formData.append('email', form.email || '');
  formData.append('travel_month', form.travel_month || '');
  formData.append('comment', form.comment);
  formData.append('title', form.title);
  formData.append('rating', form.rating);
  form.images.forEach((image) => {
    formData.append('images', image);
  });

  try {
    const csrfToken = getCSRFToken(); // 👈 Get token from helper
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/${contentType}/${objectSlug}/reviews/`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'X-CSRFToken': csrfToken, // 👈 Include CSRF header
      },
      credentials: 'include', // 👈 Ensure cookies are sent
      body: formData,
    });

    if (res.ok) {
      setSubmitted(true);
      setForm({
        name: '',
        email: '',
        travel_month: '',
        comment: '',
        title: '',
        rating: 4,
        images: [],
      });
      setImagePreviews([]);
      const data = await res.json();
      setReviews((prev) => [data, ...prev]);
    } else {
      const errorText = await res.text();
      console.error('Submission failed:', res.status, res.statusText, errorText);
      alert(`Submission failed: ${errorText || res.statusText}`);
    }
  } catch (err) {
    console.error('Submission error:', err);
    alert('An error occurred: ' + err.message);
  } finally {
    setLoading(false);
  }
};

  // Handle image click for modal
  const handleImageClick = (images, index) => {
    setSelectedReviewImages(images);
    setCurrentImageIndex(index);
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedReviewImages(null);
    setCurrentImageIndex(0);
  };

  // Navigate images
  const handlePrevImage = () => {
    if (selectedReviewImages && selectedReviewImages.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedReviewImages.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (selectedReviewImages && selectedReviewImages.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === selectedReviewImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 bg-blue-50 min-h-screen rounded-2xl ">
      {/* Top Heading */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-indigo-800">Traveler Reviews</h1>
        <p className="text-lg text-gray-600 mt-2">
          Share your amazing travel experiences with our community
        </p>
      </div>

      {/* Review Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-6 mb-10 space-y-5 border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-indigo-700">Write a Review</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trip Name</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleInput}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Destination or Trip Name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleInput}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleInput}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email (optional)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Travel Month</label>
            <input
              type="month"
              name="travel_month"
              value={form.travel_month}
              onChange={handleInput}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleRating(i)}
                className="focus:outline-none"
              >
                <Star
                  size={20}
                  fill={i <= form.rating ? '#facc15' : 'none'}
                  stroke={i <= form.rating ? '#facc15' : '#d1d5db'}
                />
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Comment</label>
          <textarea
            name="comment"
            value={form.comment}
            onChange={handleInput}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Share your experience..."
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photos</label>
          <div className="flex items-center">
            <label className="cursor-pointer bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg border border-indigo-300 transition duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 inline mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Select Photos
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1">You can upload multiple photos (max 5)</p>
          <div className="mt-3 flex flex-wrap gap-0">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-none border"
                />
                <button
                  type="button"
                  onClick={() => removeImagePreview(index)}
                  className="absolute -top-1 -right-1 bg-gray-800 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>

      {/* Reviews Display */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl shadow-md border border-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-300 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <h3 className="text-xl font-medium text-gray-500">No reviews yet</h3>
            <p className="text-gray-400 mt-2">Be the first to share your experience!</p>
          </div>
        ) : (
          reviews.map((review, index) => (
            <div
              key={review.id}
              className={`bg-white hover:bg-grey-50 hover:shadow-lg transition duration-300 border border-gray-100 p-6 rounded-xl`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {review.title || 'Review'}
                  </h3>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i <= review.rating ? '#facc15' : 'none'}
                        stroke={i <= review.rating ? '#facc15' : '#d1d5db'}
                      />
                    ))}
                  </div>
                </div>
                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                  {new Date(review.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <p className="mt-3 text-gray-700">{review.comment}</p>
              {review.images && review.images.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {review.images.map((image, i) => (
                    <img
                      key={image.id}
                      src={image.image}
                      alt={`Review ${i + 1}`}
                      className="w-20 h-20 object-cover rounded-md border cursor-pointer"
                      onClick={() => handleImageClick(review.images, i)}
                    />
                  ))}

                </div>
              )}
              <hr className="my-4 border-gray-200" />
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-semibold">
                    {(review.name || 'A').charAt(0)}
                  </div>
                  <span className="ml-3 font-medium text-gray-700">
                    {review.name || 'Anonymous'}
                  </span>
                </div>
                <button
                  onClick={() => handleLike(review.id)}
                  className="text-gray-400 hover:text-red-500 transition duration-200"
                >
                  <Heart size={20} fill="none" stroke="currentColor" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {nextPage && (
        <div className="text-center mt-6">
          <button
            onClick={() => fetchReviews(nextPage)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Load More Reviews
          </button>
        </div>
      )}
      

      {/* Image Modal */}
      {selectedReviewImages && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="relative flex items-center">
            <button
              className={`absolute left-[-40px] text-white bg-gray-800 rounded-full w-10 h-10 flex items-center justify-center ${
                selectedReviewImages.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={handlePrevImage}
              disabled={selectedReviewImages.length <= 1}
            >
              ‹
            </button>
            <img
              src={selectedReviewImages[currentImageIndex].image}
              alt="Enlarged Review"
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-md"
            />
            <button
              className={`absolute right-[-40px] text-white bg-gray-800 rounded-full w-10 h-10 flex items-center justify-center ${
                selectedReviewImages.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={handleNextImage}
              disabled={selectedReviewImages.length <= 1}
            >
              ›
            </button>
            <button
              className="absolute top-2 right-2 text-white bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center"
              onClick={handleCloseModal}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Submission Confirmation Modal */}
      {submitted && (
        <div className="fixed inset-0 bg-blue-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h3>
            <p className="text-gray-600 mb-6">
              Your review has been submitted for moderation. We appreciate your feedback!
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;