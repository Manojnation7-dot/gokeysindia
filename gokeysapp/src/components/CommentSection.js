'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { RECAPTCHA_RETRY_MESSAGE, getRecaptchaToken, startRecaptcha } from '@/lib/recaptcha';

export default function CommentSection({ blogSlug }) {

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.gokeys.in';

  const [comments, setComments] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch approved comments
  useEffect(() => {
  const fetchComments = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/blogs/${blogSlug}/comments/`);

      if (!res.ok) {
        throw new Error('Failed to fetch comments');
      }

      const data = await res.json();

      setComments(data.results || []); // FIX HERE

    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  fetchComments();
}, [blogSlug]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
        let token;
        try {
            token = await getRecaptchaToken('submit_comment'); // fresh token for every submission
        } catch (err) {
            console.error('reCAPTCHA error:', err);
            throw new Error(RECAPTCHA_RETRY_MESSAGE); // nothing is sent without a token
        }

        const payload = { ...formData, recaptcha_token: token };
        const res = await fetch(`${apiUrl}/api/blogs/${blogSlug}/comments/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            // Check if the error response is JSON
            const errorData = await res.json().catch(() => ({}));
            const backendErrorMessage = errorData.recaptcha?.[0] || errorData.detail || 'Failed to submit comment';
            throw new Error(backendErrorMessage);
        }

        const newComment = await res.json();
        if (newComment && typeof newComment === 'object') {
            // Note: If you want to show the pending comment, add it to the list.
            // setComments((prev) => [newComment, ...prev]);
        }
        
        setSuccessMessage('Comment submitted! It will appear after approval.');
        setFormData({ name: '', email: '', message: '' });
    } catch (err) {
        console.error('Submission error:', err);
        setErrorMessage(err.message || 'Error submitting comment. Please try again.');
    } finally {
        setIsSubmitting(false);
    }
};
  return (
    <section className="mt-12">
      <h2 className="gk-h2 mb-5">Comments</h2>

      {/* Comment List */}
      {comments.length > 0 ? (
        <div className="space-y-6 mb-8">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center mb-2">
                <Image
                  src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png" // Replace with dynamic avatar if available
                  alt="Avatar"
                  width={40}
                  height={40}
                  className="rounded-full mr-3"
                />
                <div>
                  <p className="font-medium text-gray-900">{comment.name}</p>
                  <p className="text-[15px] text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <p className="text-gray-700">{comment.message}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 mb-8">No comments yet. Be the first to comment!</p>
      )}

      {/* Comment Form */}
      <div className="bg-gray-50 p-6 rounded-lg shadow-md">
        <h3 className="gk-h3 mb-4">Leave a Comment</h3>
        {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}
        {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}
        <form onSubmit={handleSubmit} onFocus={startRecaptcha} className="space-y-4">
          <div>
            <label htmlFor="name" className="gk-label">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="gk-field"
            />
          </div>
          <div>
            <label htmlFor="email" className="gk-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="gk-field"
            />
          </div>
          <div>
            <label htmlFor="message" className="gk-label">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="4"
              className="gk-field"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full gk-btn gk-btn-ink ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Comment'}
          </button>
        </form>
      </div>
    </section>
  );
}