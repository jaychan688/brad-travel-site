import '../css/styles.css'
import 'lazysizes'

import MobileMenu from './modules/MobileMenu'
import RevealOnScroll from './modules/RevealOnScroll'
import StickyHeader from './modules/StickyHeader'

new StickyHeader()
new RevealOnScroll(document.querySelectorAll('.feature-item'), 75)
new RevealOnScroll(document.querySelectorAll('.testimonial'), 70)
new MobileMenu()

// Code Splitting
let modal
document.querySelectorAll('.open-modal').forEach(el => {
	el.addEventListener('click', e => {
		e.preventDefault()

		// only if modal is not import, load the modal scripts
		if (typeof modal === 'undefined') {
			// The comment is for add modal prefix to output bundle in webpack
			import(/* webpackChunkName: "modal" */ './modules/Modal.js')
				.then(module => {
					modal = new module.default()

					setTimeout(() => modal.openTheModal(), 20)
				})
				.catch(() => console.log('There was a problem.'))
		} else {
			modal.openTheModal()
		}
	})
})
