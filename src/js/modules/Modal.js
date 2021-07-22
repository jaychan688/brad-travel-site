export default class Modal {
	constructor() {
		// Inject Html first, and then querySelect html element.
		this.injectHTML()
		this.closeIcon = document.querySelector('.modal__close')
		this.openModalButtons = document.querySelectorAll('.open-modal')
		this.modal = document.querySelector('.modal')
		this.events()
	}

	events() {
		// listen for open click
		this.openModalButtons.forEach(el => {
			el.addEventListener('click', e => this.openTheModal(e))
		})
		// listen for close click
		this.closeIcon.addEventListener('click', () => this.closeTheModal())
		// pushes esc key to close modal
		document.addEventListener('keyup', e => this.keyPressHandler(e))
		// click any modal area to close modal
		document
			.querySelector('.modal')
			.addEventListener('click', () => this.closeTheModal())
	}

	openTheModal(e) {
		// prevent <a> default behavior
		e.preventDefault()
		this.modal.classList.add('modal--is-visible')
	}

	closeTheModal() {
		// close icon is a <div>, don't need to worry preventDefault.
		this.modal.classList.remove('modal--is-visible')
	}

	// press any key
	keyPressHandler(e) {
		if (e.code === 'Escape') {
			this.closeTheModal()
		}
	}

	injectHTML() {
		const modalHTML = `
    <div class="modal">
			<div class="modal__inner">
				<h2 class="section-title section-title--blue section-title--less-margin">
					<img src="images/icons/mail.svg" class="section-title__icon" />
					Get in <strong>Touch</strong>
				</h2>
				<div class="wrapper wrapper--narrow">
					<p class="modal__description">
						We will have an online order system in place soon. Until then,
						connect with us on any of the platforms below!
					</p>
				</div>
				<div class="social-icons">
					<a href="#" class="social-icons__icon">
						<img src="images/icons/facebook.svg" alt="Facebook"/>
					</a>
					<a href="#" class="social-icons__icon">
						<img src="images/icons/twitter.svg" alt="Twitter"/>
					</a>
					<a href="#" class="social-icons__icon">
						<img src="images/icons/instagram.svg" alt="Instagram"/>
					</a>
					<a href="#" class="social-icons__icon">
						<img src="images/icons/youtube.svg" alt="YouTube"/>
						</a>
				</div>
			</div>
			<div class="modal__close">X</div>
		</div>`

		document.body.insertAdjacentHTML('beforeend', modalHTML)
	}
}
