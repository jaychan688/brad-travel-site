export default class MobileMenu {
	constructor() {
		// A. Selecting elements from the DOM
		this.menuIcon = document.querySelector('.site-header__menu-icon')
		this.menuContent = document.querySelector('.site-header__menu-content')
		this.siteHeader = document.querySelector('.site-header')
		// As soon as page load, the event begin listening
		this.events()
	}

	events() {
		// B. Event handling
		// Arrow function does not manipulate the value of this keywords
		// when user click event triggered,  the arrow function will run,
		// and this will still pointer to the object (MobileMenu)
		this.menuIcon.addEventListener('click', () => this.toggleMenu())
	}

	// C. Defining functionality
	toggleMenu() {
		this.menuContent.classList.toggle('site-header__menu-content--is-visible')
		this.siteHeader.classList.toggle('site-header--is-expended')
		this.menuIcon.classList.toggle('site-header__menu-icon--close-x')
	}
}
