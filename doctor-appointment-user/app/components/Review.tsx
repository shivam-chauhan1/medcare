"use client";
import React, { useState, useEffect } from 'react';
import styles from '@/app/styles/Review.module.css';
import Image from 'next/image';
import star from '@/public/images/one_star.svg';
import { useParams } from 'next/navigation';

interface PendingReview {
    appointment_id: string;
    patient_name: string;
}

interface Review {
    review_id: string;
    rating: number;
    comments: string;
    created_at: string;
    patient_name: string;
}

export default function Review() {
    const { id } = useParams();
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentPendingPage, setCurrentPendingPage] = useState<number>(1);
    const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([]);
    const [selectedPendingReview, setSelectedPendingReview] = useState<PendingReview | null>(null);
    const [completedReviews, setCompletedReviews] = useState<Review[]>([]);
    const reviewsPerPage = 5;
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchPendingReviews();
        fetchCompletedReviews();
    }, [id]);

    const fetchPendingReviews = async () => {
        try {
            const response = await fetch(
                `http://localhost:5000/doctor/${id}/reviews/user`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                }
            );

            if (response.ok) {
                const data = await response.json();
                setPendingReviews(data.data);
            }
        } catch (error) {
            console.error('Error fetching pending reviews:', error);
        }
    };

    const fetchCompletedReviews = async () => {
        try {
            const response = await fetch(
                `http://localhost:5000/doctor/${id}/reviews`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                }
            );

            if (response.ok) {
                const data = await response.json();
                setCompletedReviews(data.data);
            }
        } catch (error) {
            console.error('Error fetching completed reviews:', error);
        }
    };

    const handleRatingClick = (value: number) => {
        setRating(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPendingReview || !rating || !comment) {
            alert('Please provide both rating and comment');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(
                `http://localhost:5000/doctor/${id}/reviews/user/${selectedPendingReview.appointment_id}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        rating: rating,
                        comment: comment
                    })
                }
            );

            if (response.ok) {
                // Remove the submitted review from pending reviews
                setPendingReviews(prev => 
                    prev.filter(review => review.appointment_id !== selectedPendingReview.appointment_id)
                );
                setRating(0);
                setComment('');
                setSelectedPendingReview(null);
                alert('Review submitted successfully!');
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePendingReviewClick = (review: PendingReview) => {
        setSelectedPendingReview(review);
    };

    // Pagination calculations
    const totalPendingPages = Math.ceil(pendingReviews.length / reviewsPerPage);
    const totalPages = Math.ceil(completedReviews.length / reviewsPerPage);
    const currentReviews = completedReviews.slice(
        (currentPage - 1) * reviewsPerPage,
        currentPage * reviewsPerPage
    );
    const currentPendingReviews = pendingReviews.slice(
        (currentPendingPage - 1) * reviewsPerPage,
        currentPendingPage * reviewsPerPage
    );

    return (
        <div className={styles.review_container}>
            

            {/* Pending Reviews Section */}
            {pendingReviews.length > 0 && (
                <div className={styles.reviews_display_section}>
                    <h2>Pending Reviews</h2>
                    <div className={styles.reviews_list}>
                        {pendingReviews.map((review) => (
                            <div key={review.appointment_id} className={styles.review_card}>
                                {selectedPendingReview?.appointment_id === review.appointment_id ? (
                                    <div className={styles.pending_review_form}>
                                        <div className={styles.review_header}>
                                            <h3>{review.patient_name}</h3>
                                            <button 
                                                className={styles.cancel_button}
                                                onClick={() => setSelectedPendingReview(null)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                        <div className={styles.rating_stars}>
                                            {[1, 2, 3, 4, 5].map((value) => (
                                                <div
                                                    key={value}
                                                    className={`${styles.star} ${value <= rating ? styles.active : ''}`}
                                                    onClick={() => handleRatingClick(value)}
                                                >
                                                    <Image
                                                        src={star}
                                                        alt={`${value} star`}
                                                        height={24}
                                                        width={24}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Write your review here..."
                                            className={styles.comment_input}
                                            required
                                        />
                                        <button 
                                            type="submit" 
                                            className={styles.submit_button}
                                            onClick={handleSubmit}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                                        </button>
                                    </div>
                                ) : (
                                    <div 
                                        className={styles.pending_review_card}
                                        onClick={() => setSelectedPendingReview(review)}
                                    >
                                        <div className={styles.review_header}>
                                            <h3>{review.patient_name}</h3>
                                            <span className={styles.pending_status}>Pending</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {totalPendingPages > 1 && (
                        <div className={styles.pagination}>
                            <button
                                onClick={() => setCurrentPendingPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPendingPage === 1}
                                className={styles.pagination_button}
                            >
                                Previous
                            </button>
                            <span className={styles.page_info}>
                                Page {currentPendingPage} of {totalPendingPages}
                            </span>
                            <button
                                onClick={() => setCurrentPendingPage(prev => Math.min(prev + 1, totalPendingPages))}
                                disabled={currentPendingPage === totalPendingPages}
                                className={styles.pagination_button}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Completed Reviews Section */}
            <div className={styles.reviews_display_section}>
                <h2>Patient Reviews</h2>
                <div className={styles.reviews_list}>
                    {currentReviews.map((review: Review) => (
                        <div key={review.review_id} className={styles.review_card}>
                            <div className={styles.review_header}>
                                <h3>{review.patient_name}</h3>
                                <div className={styles.review_rating}>
                                    {[...Array(5)].map((_, index) => (
                                        <div
                                            key={index}
                                            className={`${styles.star} ${
                                                index < review.rating ? styles.active : ''
                                            }`}
                                        >
                                            <Image
                                                src={star}
                                                alt={`${index + 1} star`}
                                                height={16}
                                                width={16}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <p className={styles.review_comment}>{review.comments}</p>
                            <span className={styles.review_date}>{new Date(review.created_at).toLocaleDateString()}</span>
                        </div>
                    ))}
                </div>
                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={styles.pagination_button}
                        >
                            Previous
                        </button>
                        <span className={styles.page_info}>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={styles.pagination_button}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
} 