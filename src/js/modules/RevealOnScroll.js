import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'

export default class RevealOnScroll {
	constructor(els, thresholdPercent) {
		this.itemsToReveal = els
		this.thresholdPercent = thresholdPercent
		this.browserHeight = window.innerHeight
		this.hideInitially()

		this.scrollThrottle = throttle(this.calcCaller, 200).bind(this)
		this.events()
	}

	events() {
		window.addEventListener('scroll', this.scrollThrottle)
		// Until the last resize (loose the mouse click), after 300 millscend
		// fire the arrowFn, debounce chan help to do this.
		window.addEventListener(
			'resize',
			debounce(() => {
				// After resizing, Update this.browserHeight value
				this.browserHeight = window.innerHeight
			}, 300)
		)
	}

	calcCaller() {
		this.itemsToReveal.forEach(el => {
			// el.isRevealed is initail attached in hideInitially()
			// and become true in calculateIfScrolledTo() when the content is reveal
			// and stop calculate
			if (el.isRevealed == false) {
				this.calculateIfScrolledTo(el)
			}
		})
	}

	calculateIfScrolledTo(el) {
		/**
		 * Only if the elements top edge has cross the bottom edge of
		 * the browser's viewport, start to calculate.
		 * How far down you're scrolled from the very top of the page plus
		 * the inner viewport hight(window.innerHeight) greater than the
		 * current elements top edge, match the above condition.
		 */
		if (window.scrollY + this.browserHeight > el.offsetTop) {
			// 計算從頁面最上方到 element 之間距離, 占整個頁面的 "高度長" 的比率
			const scrollPercent =
				(el.getBoundingClientRect().y / this.browserHeight) * 100
			// 傳入的參數高度比大於目前計算的高度比，顯示頁面，並改 el.isRevealed 為 true
			if (scrollPercent < this.thresholdPercent) {
				el.classList.add('reveal-item--is-visible')
				el.isRevealed = true

				if (el.isLastItem) {
					window.removeEventListener('scroll', this.scrollThrottle)
				}
			}
		}
	}

	hideInitially() {
		this.itemsToReveal.forEach(el => {
			el.classList.add('reveal-item')
			el.isRevealed = false
		})
		// select the last item and attach isLastItem property to it
		this.itemsToReveal[this.itemsToReveal.length - 1].isLastItem = true
	}
}

new RevealOnScroll(document.querySelectorAll('.feature-item'), 75)
