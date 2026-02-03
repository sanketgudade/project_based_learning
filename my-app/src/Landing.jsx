import React, { useState, useEffect, useRef } from 'react';
import './landing.css'; // We'll create this CSS file separately

const LandingPage = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        organization: '',
        message: ''
    });
    
    const headerRef = useRef(null);
    const navMobileRef = useRef(null);
    const loginModalRef = useRef(null);

    // Handle scroll effect for header
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close modals/menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navMobileRef.current && 
                isMobileMenuOpen && 
                !navMobileRef.current.contains(event.target) &&
                !event.target.closest('.mobile-menu-btn')) {
                closeMobileMenu();
            }
            
            if (loginModalRef.current && 
                isLoginModalOpen && 
                !loginModalRef.current.contains(event.target) &&
                !event.target.closest('.login-button')) {
                closeLoginModal();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobileMenuOpen, isLoginModalOpen]);

    // Close modals/menus on escape key
    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                closeMobileMenu();
                closeLoginModal();
            }
        };

        document.addEventListener('keydown', handleEscapeKey);
        return () => document.removeEventListener('keydown', handleEscapeKey);
    }, []);

    // Prevent body scroll when modals are open
    useEffect(() => {
        if (isMobileMenuOpen || isLoginModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isMobileMenuOpen, isLoginModalOpen]);

    // Mobile menu functions
    const openMobileMenu = () => setIsMobileMenuOpen(true);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    // Login modal functions
    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);

    // Smooth scroll to section
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
        closeMobileMenu();
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle contact form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('contact_form.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(formData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                showMessage('Message sent successfully! We\'ll get back to you soon.', 'success');
                setFormData({
                    name: '',
                    email: '',
                    organization: '',
                    message: ''
                });
            } else {
                showMessage('Failed to send message. Please try again.', 'error');
            }
        } catch (error) {
            showMessage('Network error. Please try again.', 'error');
        }
    };

    // Show message function
    const showMessage = (message, type) => {
        // Create and show a temporary message
        const alert = document.createElement('div');
        alert.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
            z-index: 3000;
            animation: fadeInUp 0.3s ease-out;
            display: flex;
            align-items: center;
            gap: 12px;
            max-width: 400px;
        `;
        alert.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.style.animation = 'fadeInUp 0.3s ease-out reverse';
            setTimeout(() => alert.remove(), 300);
        }, 3000);
    };

    return (
        <>
            {/* Header */}
            <header className={`header ${isScrolled ? 'scrolled' : ''}`} id="header" ref={headerRef}>
                <div className="container header-container">
                    <a href="#" className="logo">
                        <div className="logo-container">
                            <div className="logo-icon">
                                <i className="fas fa-hands-helping"></i>
                            </div>
                        </div>
                        <span className="logo-text">Sarathi</span>
                    </a>

                    {/* Desktop Navigation */}
                    <div className="nav-desktop">
                        <nav>
                            <ul className="nav-links">
                                <li><a href="#home" className="nav-link active" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a></li>
                                <li><a href="#features" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Features</a></li>
                                <li><a href="#about" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a></li>
                                <li><a href="#team" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('team'); }}>Team</a></li>
                                <li><a href="#contact" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a></li>
                            </ul>
                        </nav>
                        <button className="btn btn-primary login-button" onClick={openLoginModal}>
                            <i className="fas fa-sign-in-alt"></i> Login
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="mobile-menu-btn" id="mobileMenuBtn" onClick={openMobileMenu}>
                        <i className="fas fa-bars"></i>
                    </button>
                </div>

                {/* Mobile Navigation */}
                <div className={`nav-mobile ${isMobileMenuOpen ? 'active' : ''}`} id="navMobile" ref={navMobileRef}>
                    <button className="mobile-menu-close" id="mobileMenuClose" onClick={closeMobileMenu}>
                        <i className="fas fa-times"></i>
                    </button>
                    <nav>
                        <ul className="nav-links">
                            <li><a href="#home" className="nav-link active" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a></li>
                            <li><a href="#features" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Features</a></li>
                            <li><a href="#about" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a></li>
                            <li><a href="#team" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('team'); }}>Team</a></li>
                            <li><a href="#contact" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a></li>
                        </ul>
                    </nav>
                    <button className="btn btn-primary mobile-login-btn" onClick={() => { openLoginModal(); closeMobileMenu(); }}>
                        <i className="fas fa-sign-in-alt"></i> Login
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero" id="home">
                <div className="container">
                    <div className="hero-content animate-fade-up">
                        <h1>Streamline Your <span className="text-primary">Field Operations</span> with Precision</h1>
                        <p>Sarathi provides a comprehensive field management platform for tracking attendance, managing tasks, and coordinating teams efficiently across various industries.</p>
                        
                        <div className="hero-buttons">
                            <button className="btn btn-primary" onClick={openLoginModal}>
                                <i className="fas fa-rocket"></i> Get Started
                            </button>
                            <a href="register_problem.php" className="btn" style={{background: '#f59e0b', color: 'white'}}>
                                <i className="fas fa-exclamation-circle"></i> Report Community Problem
                            </a>
                            <button className="btn btn-secondary">
                                <i className="fas fa-play-circle"></i> Watch Demo
                            </button>
                        </div>
                        
                        <div className="hero-stats">
                            <div className="stat-item">
                                <div className="stat-icon">
                                    <i className="fas fa-users"></i>
                                </div>
                                <div>
                                    <div className="stat-number">5000+</div>
                                    <div className="stat-label">Active Users</div>
                                </div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-icon">
                                    <i className="fas fa-check-circle"></i>
                                </div>
                                <div>
                                    <div className="stat-number">99%</div>
                                    <div className="stat-label">Accuracy Rate</div>
                                </div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-icon">
                                    <i className="fas fa-clock"></i>
                                </div>
                                <div>
                                    <div className="stat-number">24/7</div>
                                    <div className="stat-label">Support</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features" id="features">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Comprehensive Features</h2>
                        <p className="section-subtitle">Everything you need for efficient field management in one platform</p>
                    </div>

                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div className="feature-card animate-fade-up" key={index} style={{animationDelay: `${index * 0.1}s`}}>
                                <div className="feature-icon">
                                    <i className={feature.icon}></i>
                                </div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="about" id="about">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Our Mission</h2>
                        <p className="section-subtitle">Empowering organizations with efficient field management solutions</p>
                    </div>

                    <div className="about-content">
                        <div className="about-image animate-fade-up">
                            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Team Collaboration" />
                        </div>

                        <div className="animate-fade-up" style={{animationDelay: '0.2s'}}>
                            <h3 className="mb-2">Streamlining Field Operations</h3>
                            <p className="mb-3">
                                At Sarathi, we're committed to transforming field operations through innovative technology. Our platform is designed to simplify complex processes and enhance productivity across various industries.
                            </p>
                            <p className="mb-4">
                                We focus on creating intuitive solutions that address real-world challenges in field management, from attendance tracking to comprehensive reporting.
                            </p>

                            <div className="mission-cards">
                                {missionCards.map((card, index) => (
                                    <div className="mission-card animate-fade-up" key={index} style={{animationDelay: `${0.3 + index * 0.1}s`}}>
                                        <i className={card.icon}></i>
                                        <h4>{card.title}</h4>
                                        <p>{card.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="team" id="team">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Our Team</h2>
                        <p className="section-subtitle">The dedicated professionals behind Sarathi</p>
                    </div>

                    <div className="team-grid">
                        {teamMembers.map((member, index) => (
                            <div className="team-card animate-fade-up" key={index} style={{animationDelay: `${index * 0.1}s`}}>
                                <div className="team-avatar">
                                    <i className="fas fa-user"></i>
                                </div>
                                <h3>{member.name}</h3>
                                <p className="text-primary mb-2">{member.role}</p>
                                <p>{member.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="contact" id="contact">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Contact Us</h2>
                        <p className="section-subtitle">Get in touch with our team for more information</p>
                    </div>

                    <div className="contact-grid">
                        <div className="contact-info">
                            {contactInfo.map((info, index) => (
                                <div className="contact-item animate-fade-up" key={index} style={{animationDelay: `${index * 0.1}s`}}>
                                    <div className="contact-icon">
                                        <i className={info.icon}></i>
                                    </div>
                                    <div>
                                        <h3>{info.title}</h3>
                                        <p dangerouslySetInnerHTML={{__html: info.content}}></p>
                                    </div>
                                </div>
                            ))}

                            <div className="mt-4">
                                <h3 className="mb-3">Connect With Us</h3>
                                <div className="social-links">
                                    {socialLinks.map((link, index) => (
                                        <a href="#" key={index} aria-label={link.label}>
                                            <i className={link.icon}></i>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="contact-form animate-fade-up" style={{animationDelay: '0.4s'}}>
                            <h3 className="mb-3">Send Us a Message</h3>
                            <form id="contactForm" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Your Name</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        name="name" 
                                        placeholder="Enter your name" 
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required 
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Email Address</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        name="email" 
                                        placeholder="you@example.com" 
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required 
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Organization</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        name="organization" 
                                        placeholder="Your company name"
                                        value={formData.organization}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Message</label>
                                    <textarea 
                                        className="form-control" 
                                        name="message" 
                                        rows="4" 
                                        placeholder="How can we help you?"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                    ></textarea>
                                </div>

                                <button type="submit" className="btn btn-primary" style={{width: '100%'}}>
                                    <i className="fas fa-paper-plane"></i> Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-col">
                            <div className="footer-logo">
                                <div className="logo-container">
                                    <div className="logo-icon">
                                        <i className="fas fa-hands-helping"></i>
                                    </div>
                                </div>
                                <span>Sarathi</span>
                            </div>
                            <p className="mb-3">
                                Comprehensive field management solutions for modern organizations. Streamline operations and enhance productivity with our platform.
                            </p>
                            <div className="social-links">
                                {socialLinks.map((link, index) => (
                                    <a href="#" key={index} aria-label={link.label}>
                                        <i className={link.icon}></i>
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div className="footer-col">
                            <h3>Quick Links</h3>
                            <ul className="footer-links">
                                {quickLinks.map((link, index) => (
                                    <li key={index}>
                                        <a href={link.href} onClick={(e) => { e.preventDefault(); scrollToSection(link.section); }}>
                                            {link.text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="footer-col">
                            <h3>Login Portals</h3>
                            <ul className="footer-links">
                                {loginPortals.map((portal, index) => (
                                    <li key={index}>
                                        <a href={portal.href}>
                                            <i className={portal.icon}></i> {portal.text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="footer-col">
                            <h3>Resources</h3>
                            <ul className="footer-links">
                                {resources.map((resource, index) => (
                                    <li key={index}>
                                        <a href={resource.href}>{resource.text}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="copyright">
                        <p>© 2024 Sarathi Field Management System. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* Login Options Modal */}
            <div className={`modal ${isLoginModalOpen ? 'active' : ''}`} id="loginModal">
                <div className="modal-content" ref={loginModalRef}>
                    <div className="modal-header">
                        <h2>Welcome to Sarathi</h2>
                        <p className="mt-1">Choose your access method</p>
                        <button className="close-modal" onClick={closeLoginModal}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    <div className="login-options">
                        {loginOptions.map((option, index) => (
                            <a href={option.href} className={`option-card ${option.type}`} key={index}>
                                <i className={option.icon}></i>
                                <h3>{option.title}</h3>
                                <p>{option.description}</p>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

// Data arrays
const features = [
    {
        icon: 'fas fa-map-marker-alt',
        title: 'Smart Attendance',
        description: 'Location-based check-ins with real-time tracking and automated reporting for accurate attendance management.'
    },
    {
        icon: 'fas fa-tasks',
        title: 'Task Management',
        description: 'Assign, track, and manage field tasks with priority levels, deadlines, and progress monitoring.'
    },
    {
        icon: 'fas fa-calendar-alt',
        title: 'Leave & Shift Management',
        description: 'Streamline leave requests and shift scheduling with automated approvals and calendar integration.'
    },
    {
        icon: 'fas fa-camera',
        title: 'Photo Reports',
        description: 'Capture and tag field photos with GPS metadata for comprehensive visual documentation.'
    },
    {
        icon: 'fas fa-chart-pie',
        title: 'Analytics Dashboard',
        description: 'Gain insights with detailed analytics and customizable reports for data-driven decisions.'
    },
    {
        icon: 'fas fa-mobile-alt',
        title: 'Mobile Ready',
        description: 'Fully responsive platform that works seamlessly across all devices and screen sizes.'
    }
];

const missionCards = [
    {
        icon: 'fas fa-bullseye',
        title: 'Precision Focus',
        description: 'Accurate and reliable solutions'
    },
    {
        icon: 'fas fa-lightbulb',
        title: 'Innovation Driven',
        description: 'Continuous improvement'
    }
];

const teamMembers = [
    {
        name: 'Kaustubh Nagavekar',
        role: 'Founder & CEO',
        description: 'Leading the vision and strategy'
    },
    {
        name: 'Pratik',
        role: 'Product Lead',
        description: 'Driving product development'
    },
    {
        name: 'Laxman',
        role: 'Technical Lead',
        description: 'Architecting technical solutions'
    },
    {
        name: 'Sanket Gudade',
        role: 'Operations',
        description: 'Managing implementation'
    }
];

const contactInfo = [
    {
        icon: 'fas fa-map-marker-alt',
        title: 'Visit Our Office',
        content: '123 Business Street, Suite 100<br>Mumbai, India 400001'
    },
    {
        icon: 'fas fa-phone',
        title: 'Call Us',
        content: '+91 22 1234 5678<br>Monday - Friday, 9AM-6PM'
    },
    {
        icon: 'fas fa-envelope',
        title: 'Email Us',
        content: 'info@sarathi.com<br>support@sarathi.com'
    }
];

const socialLinks = [
    { icon: 'fab fa-twitter', label: 'Twitter' },
    { icon: 'fab fa-linkedin', label: 'LinkedIn' },
    { icon: 'fab fa-facebook', label: 'Facebook' },
    { icon: 'fab fa-instagram', label: 'Instagram' }
];

const quickLinks = [
    { href: '#home', text: 'Home', section: 'home' },
    { href: '#features', text: 'Features', section: 'features' },
    { href: '#about', text: 'About', section: 'about' },
    { href: '#team', text: 'Team', section: 'team' }
];

const loginPortals = [
    { href: 'volunteer_login.php', icon: 'fas fa-user', text: 'Volunteer Login' },
    { href: 'adminlogin.php', icon: 'fas fa-user-shield', text: 'Admin Login' },
    { href: 'volunteer_request_fixed.php', icon: 'fas fa-user-plus', text: 'Create Volunteer Account' }
];

const resources = [
    { href: '#', text: 'Documentation' },
    { href: '#', text: 'API' },
    { href: '#', text: 'Support' },
    { href: '#contact', text: 'Contact' }
];

const loginOptions = [
    {
        type: 'volunteer',
        icon: 'fas fa-user',
        title: 'Volunteer Login',
        description: 'Access your volunteer dashboard to manage tasks, track attendance, and submit reports.',
        href: 'volunteer_login.php'
    },
    {
        type: 'admin',
        icon: 'fas fa-user-shield',
        title: 'Admin Login',
        description: 'Access the admin panel to manage volunteers, approve requests, and view analytics.',
        href: 'adminlogin.php'
    },
    {
        type: 'register',
        icon: 'fas fa-user-plus',
        title: 'Create Volunteer Account',
        description: 'Register as a new volunteer. Submit your details for admin approval to get started.',
        href: 'volunteer_request_fixed.php'
    }
];

export default LandingPage;