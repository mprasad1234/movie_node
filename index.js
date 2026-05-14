const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// In-memory storage
let movies = [];
let bookings = [];
let nextBookingId = 1;

// Initialize movies
function initMovies() {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const tomorrow = new Date(now.setDate(now.getDate() + 1)).toISOString().split('T')[0];
    const dayAfter = new Date(now.setDate(now.getDate() + 1)).toISOString().split('T')[0];
    
    movies = [
        {
            id: 1,
            title: "Inception",
            language: "English",
            genre: "Sci-Fi/Action",
            duration: "2h 28m",
            rating: "UA",
            poster: "🎬",
            description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
            cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
            director: "Christopher Nolan",
            showtimes: [
                { id: 101, time: "10:30 AM", date: today, price: 180, availableSeats: 50 },
                { id: 102, time: "2:00 PM", date: today, price: 200, availableSeats: 45 },
                { id: 103, time: "6:30 PM", date: today, price: 220, availableSeats: 60 },
                { id: 104, time: "9:45 PM", date: today, price: 250, availableSeats: 40 }
            ]
        },
        {
            id: 2,
            title: "The Dark Knight",
            language: "English",
            genre: "Action/Crime",
            duration: "2h 32m",
            rating: "UA",
            poster: "🦇",
            description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
            cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
            director: "Christopher Nolan",
            showtimes: [
                { id: 201, time: "11:00 AM", date: today, price: 180, availableSeats: 55 },
                { id: 202, time: "3:00 PM", date: today, price: 200, availableSeats: 48 },
                { id: 203, time: "7:30 PM", date: today, price: 220, availableSeats: 52 },
                { id: 204, time: "10:30 PM", date: today, price: 250, availableSeats: 38 }
            ]
        },
        {
            id: 3,
            title: "Interstellar",
            language: "English",
            genre: "Sci-Fi/Drama",
            duration: "2h 49m",
            rating: "UA",
            poster: "🌌",
            description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
            cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
            director: "Christopher Nolan",
            showtimes: [
                { id: 301, time: "9:00 AM", date: today, price: 180, availableSeats: 42 },
                { id: 302, time: "1:00 PM", date: today, price: 200, availableSeats: 56 },
                { id: 303, time: "5:30 PM", date: today, price: 220, availableSeats: 49 },
                { id: 304, time: "9:00 PM", date: today, price: 250, availableSeats: 35 }
            ]
        },
        {
            id: 4,
            title: "3 Idiots",
            language: "Hindi",
            genre: "Comedy/Drama",
            duration: "2h 50m",
            rating: "U",
            poster: "🎓",
            description: "Two friends are searching for their long lost companion. They revisit their college days and recall the memories of their friend who inspired them to think differently.",
            cast: ["Aamir Khan", "Madhavan", "Sharman Joshi"],
            director: "Rajkumar Hirani",
            showtimes: [
                { id: 401, time: "10:00 AM", date: today, price: 160, availableSeats: 60 },
                { id: 402, time: "2:30 PM", date: today, price: 180, availableSeats: 58 },
                { id: 403, time: "7:00 PM", date: today, price: 200, availableSeats: 55 }
            ]
        },
        {
            id: 5,
            title: "RRR",
            language: "Telugu/Hindi",
            genre: "Action/Drama",
            duration: "3h 7m",
            rating: "UA",
            poster: "🔥",
            description: "A fictitious story about two legendary revolutionaries and their journey away from home before they started fighting for their country.",
            cast: ["Ram Charan", "Jr NTR", "Alia Bhatt"],
            director: "S.S. Rajamouli",
            showtimes: [
                { id: 501, time: "12:00 PM", date: today, price: 200, availableSeats: 65 },
                { id: 502, time: "4:00 PM", date: today, price: 220, availableSeats: 60 },
                { id: 503, time: "8:00 PM", date: today, price: 250, availableSeats: 50 }
            ]
        },
        {
            id: 6,
            title: "Jawan",
            language: "Hindi",
            genre: "Action/Thriller",
            duration: "2h 49m",
            rating: "UA",
            poster: "💪",
            description: "A prison warden recruits inmates to commit outrageous crimes that shed light on corruption and injustice.",
            cast: ["Shah Rukh Khan", "Nayanthara", "Vijay Sethupathi"],
            director: "Atlee",
            showtimes: [
                { id: 601, time: "11:30 AM", date: today, price: 200, availableSeats: 70 },
                { id: 602, time: "3:30 PM", date: today, price: 220, availableSeats: 65 },
                { id: 603, time: "7:30 PM", date: today, price: 250, availableSeats: 55 }
            ]
        }
    ];
}

initMovies();

// API Routes

// Get all movies
app.get('/api/movies', (req, res) => {
    res.json({ success: true, movies: movies });
});

// Get movie by ID
app.get('/api/movies/:id', (req, res) => {
    const movie = movies.find(m => m.id === parseInt(req.params.id));
    if (!movie) {
        return res.status(404).json({ error: 'Movie not found' });
    }
    res.json({ success: true, movie: movie });
});

// Get showtimes for a movie
app.get('/api/movies/:id/showtimes', (req, res) => {
    const movie = movies.find(m => m.id === parseInt(req.params.id));
    if (!movie) {
        return res.status(404).json({ error: 'Movie not found' });
    }
    res.json({ success: true, showtimes: movie.showtimes });
});

// Get seat layout for a show
app.get('/api/showtimes/:showId/seats', (req, res) => {
    const showId = parseInt(req.params.showId);
    
    // Find the showtime
    let showtime = null;
    let movie = null;
    
    for (const m of movies) {
        const st = m.showtimes.find(s => s.id === showId);
        if (st) {
            showtime = st;
            movie = m;
            break;
        }
    }
    
    if (!showtime) {
        return res.status(404).json({ error: 'Showtime not found' });
    }
    
    // Generate seat layout (10 rows, 10 columns)
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const seats = [];
    
    // Get booked seats for this show from bookings
    const bookedSeats = bookings
        .filter(b => b.showId === showId)
        .flatMap(b => b.seats);
    
    for (let i = 0; i < rows.length; i++) {
        for (let j = 1; j <= 10; j++) {
            const seatNumber = `${rows[i]}${j}`;
            const isBooked = bookedSeats.includes(seatNumber);
            const category = i < 3 ? 'platinum' : (i < 7 ? 'gold' : 'silver');
            let price = showtime.price;
            
            if (category === 'platinum') price += 50;
            else if (category === 'silver') price -= 30;
            
            seats.push({
                id: seatNumber,
                row: rows[i],
                number: j,
                category: category,
                price: price,
                isBooked: isBooked,
                isSelected: false
            });
        }
    }
    
    res.json({ success: true, seats: seats, showtime: showtime, movie: movie });
});

// Book tickets
app.post('/api/book', (req, res) => {
    const { showId, seats, userName, userEmail, userPhone, totalAmount } = req.body;
    
    if (!showId || !seats || seats.length === 0) {
        return res.status(400).json({ error: 'Invalid booking request' });
    }
    
    if (!userName || !userEmail || !userPhone) {
        return res.status(400).json({ error: 'User details required' });
    }
    
    // Find the showtime
    let showtime = null;
    let movie = null;
    
    for (const m of movies) {
        const st = m.showtimes.find(s => s.id === showId);
        if (st) {
            showtime = st;
            movie = m;
            break;
        }
    }
    
    if (!showtime) {
        return res.status(404).json({ error: 'Showtime not found' });
    }
    
    // Check if seats are available
    const bookedSeats = bookings
        .filter(b => b.showId === showId)
        .flatMap(b => b.seats);
    
    const unavailableSeats = seats.filter(s => bookedSeats.includes(s));
    if (unavailableSeats.length > 0) {
        return res.status(409).json({ 
            error: 'Some seats are no longer available', 
            unavailableSeats: unavailableSeats 
        });
    }
    
    // Create booking
    const booking = {
        bookingId: `BK${Date.now()}${Math.floor(Math.random() * 1000)}`,
        showId: showId,
        movieTitle: movie.title,
        showtime: showtime.time,
        date: showtime.date,
        seats: seats,
        userName: userName,
        userEmail: userEmail,
        userPhone: userPhone,
        totalAmount: totalAmount,
        bookingDate: new Date().toISOString(),
        status: 'confirmed'
    };
    
    bookings.push(booking);
    
    // Update available seats count
    showtime.availableSeats -= seats.length;
    
    res.json({ success: true, booking: booking });
});

// Get booking by ID
app.get('/api/bookings/:bookingId', (req, res) => {
    const booking = bookings.find(b => b.bookingId === req.params.bookingId);
    if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
    }
    res.json({ success: true, booking: booking });
});

// Get user bookings
app.get('/api/user/bookings/:email', (req, res) => {
    const userBookings = bookings.filter(b => b.userEmail === req.params.email);
    res.json({ success: true, bookings: userBookings });
});

// Cancel booking
app.post('/api/cancel/:bookingId', (req, res) => {
    const bookingIndex = bookings.findIndex(b => b.bookingId === req.params.bookingId);
    
    if (bookingIndex === -1) {
        return res.status(404).json({ error: 'Booking not found' });
    }
    
    const booking = bookings[bookingIndex];
    
    // Find showtime and restore seats
    for (const movie of movies) {
        const showtime = movie.showtimes.find(s => s.id === booking.showId);
        if (showtime) {
            showtime.availableSeats += booking.seats.length;
            break;
        }
    }
    
    bookings.splice(bookingIndex, 1);
    res.json({ success: true, message: 'Booking cancelled successfully' });
});

// Serve static website
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🎬 Movie Ticket Booking System running on http://localhost:${PORT}`);
    console.log(`🍿 Book your tickets now!`);
});
