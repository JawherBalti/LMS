export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(price)
}

export const formatTotalReviews = (reviews: number) => {
    if (reviews >= 1000 && reviews < 1000000) {
        return (reviews / 1000).toFixed(1) + 'K';
    } else if (reviews >= 1000000) {
        return (reviews / 1000000).toFixed(1) + 'M';
    } else {
        return reviews;
    }
}

export const formatCourseReview = (courseReview: number) => {
    return courseReview % 1 === 0 ? courseReview : courseReview?.toFixed(1)
}

export const formatDate = (date: Date) => {
    const pad = (num: number) => String(num).padStart(2, '0');

    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1); // Months are 0-indexed in JavaScript
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}