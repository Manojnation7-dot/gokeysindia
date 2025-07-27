"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getCSRFToken } from "@/lib/getCSRFToken";

export default function CommentSection({ blogSlug }) {
  const [comments, setComments] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Fetch approved comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/blogs/${blogSlug}/comments/`);
        if (!res.ok) throw new Error("Failed to fetch comments");
        const data = await res.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [blogSlug]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const csrfToken = getCSRFToken();

      const res = await fetch(`${apiUrl}/api/blogs/${blogSlug}/comments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to submit comment");

      setSuccessMessage("Comment submitted! It will appear after approval.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setErrorMessage("Error submitting comment. Please try again.");
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
                    {new Date(comment.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
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
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="4"
              className="w-full p-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Comment"}
          </button>
        </form>
      </div>
    </section>
  );
}
