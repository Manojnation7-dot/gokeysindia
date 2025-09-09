'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function CommentSection({ blogSlug }) {
  const [comments, setComments] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Fetch approved comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/blogs/${blogSlug}/comments/`);
        if (!res.ok) throw new Error('Failed to fetch comments');
        const data = await res.json();
        setComments(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchComments();
  }, [blogSlug]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // 1️⃣ Get reCAPTCHA token
      const token = await new Promise((resolve, reject) => {
        if (!window.grecaptcha) return reject(new Error('reCAPTCHA not loaded'));
        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action: 'submit_comment' })
            .then(resolve)
            .catch(reject);
        });
      });

      // 2️⃣ Send POST request
      const res = await fetch(`${apiUrl}/api/blogs/${blogSlug}/comments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ ...formData, recaptcha_token: token }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const message = errorData?.recaptcha?.[0] || errorData?.detail || 'Failed to submit comment';
        throw new Error(message);
      }

      const newComment = await res.json();
      setComments((prev) => [newComment, ...prev]);
      setSuccessMessage('Comment submitted! It will appear after approval.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || 'Error submitting comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Comments</h2>

      {/* Comment List */}
      {comments.length > 0 ? (
        <div className="space-y-6 mb-8">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center mb-2">
                <Image
                  src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"
                  alt="Avatar"
                  width={40}
                  height={40}
                  className="rounded-full mr-3"
                />
                <div>
                  <p className="font-medium text-gray-900">{comment.name}</p>
                  <p className="text-sm text-gray-500">
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
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Leave a Comment</h3>
        {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}
        {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <textarea
            name="message"
            placeholder="Comment"
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
            rows={4}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 ${
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
