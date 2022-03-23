

function WordReplace(main) {

    // Cache / State
    const headers = main.querySelectorAll('[data-word-index]')
    const svgPaths = Array.from(main.querySelectorAll('.st0-logo-letter')).reverse()
    const svgDecorations = Array.from(main.querySelectorAll('.dodads > *'))
    const xmlns = "http://www.w3.org/2000/svg";
    let header_data = []

    const observer = new ResizeObserver(entries => {
        console.log('entries :', entries)
        // observe(entries)
    })
    // observer.observe(main)

    const observe = function (inView) {
        if (inView && !shown) {
            // Will finish a screen resize here from observer ....
        }
    }

    const setTransformOrigin = (svg) => {
        const [x, y, width, height] = svg.getAttribute('viewBox').split(' ')
        const children = svg.children

        Array.from(children).forEach(child => {
            const { x, y, width, height } = child.getBBox()
            child.style.transformOrigin = (x + width / 2) + 'px ' + (y + height / 2) + 'px'
        })
    }

    this.reveal = function (e) {
        let index = 0
        let wordIndex = 0
        const animate = () => {
            const headerObj = header_data[index]

            if (index === 0) {
                headerObj.el.style.transform = 'translate(-50%, ' + headerObj.height + 'px)'

                headerObj.el.addEventListener('transitionend', e => {

                    e.target.style.opacity = 0
                    index++
                    animate()
                })
            } else if (index === 1) {
                let letters = headerObj[wordIndex].letters
                let lettersLength = letters.length

                // Adjust number if wordIndex true for dodads to display fast or delay at the end
                const transitionElem = headerObj.length - 1 == wordIndex ? 4 : lettersLength - 1

                for (let i = lettersLength - 1; i >= 0; i--) {

                    setTimeout(() => {
                        letters[i].style.transform = 'translateY(0) rotate(0deg)'
                    }, i * 70)
                }

                // Start next line of animations when last letter is done animating
                letters[transitionElem].addEventListener('transitionend', e => {

                    headerObj[wordIndex].el.style.overflow = 'visible'
                    wordIndex++

                    // Stops at the last word
                    if (headerObj[wordIndex]) {
                        animate()
                    } else {
                        index++
                        animate()
                    }
                })
            } else if (index === 2) {
                for (let i = svgDecorations.length - 1; i >= 0; i--) {
                    let tagName = svgDecorations[i].tagName

                    setTimeout(() => {
                        if (tagName === 'line') {
                            svgDecorations[i].style.transform = 'scale(1) rotate(360deg)'
                            svgDecorations[i].style.strokeWidth = 0
                        } else {
                            svgDecorations[i].style.transform = 'scale(1.05)'
                            svgDecorations[i].style.strokeWidth = 0

                        }
                    }, i * 70)
                }
            }
        }
        animate()
    }

    const loadLetters = () => {
        let i = headers.length

        while (i--) {
            const step = headers[i].dataset.wordIndex

            /* First step Image element */
            if (step == 1) {
                const nextElementHeight = headers[i].parentNode.getBoundingClientRect().height - headers[i].offsetTop

                header_data[0] = {
                    height: nextElementHeight,
                    el: headers[i]
                }
            /* Second step for all animated letters */
            } else if (step == 2) {

                /* SVG elements */
                if (headers[i].tagName === 'svg') {

                    setTransformOrigin(headers[i])
                    const svg_height = Number(headers[i].getAttribute('viewBox').split(' ')[3])
                    const g = document.createElementNS(xmlns, "g");
                    g.classList.add("header--word")
                    const header_text = svgPaths.map(path => g.appendChild(path))

                    headers[i].appendChild(g)

                    // If array doesn't have any data makes a new array to add data too
                    if (!header_data[1]) header_data[1] = []
                    header_data[1].unshift({ height: svg_height, el: headers[i], letters: header_text })

                /* HTML elements */
                } else {
                    const header_text = headers[i].textContent.split(/\s+/).map((word) => {
                        return '<div class="header--word">' + ' <span>' + word.split('').join('</span><span>') + '</span>' + '</div>&nbsp;'
                    }).join('')

                    headers[i].innerHTML = header_text
                    const newHeight = headers[i].getBoundingClientRect().height

                    // If array doesn't have any data makes a new array to add data too
                    if (!header_data[1]) header_data[1] = []
                    header_data[1].unshift({ height: newHeight, el: headers[i], letters: headers[i].querySelectorAll('.header--word span') })

                }
            /* Third step for any random Dodads */
            } else if (step == 3) {
                // last step either push to header_data array here,  or loop through just selector elements in the step 2 animate()
            }
           headers[i].style.visibility = 'visible'
        }
    }
    loadLetters()
}


function wordReplace() {

    /* Word__Reveals to Load */
    const sections = document.querySelectorAll('.Word__Reveal')

    /* Loops through all the sections on the page */
    return Array.from(sections).map(carouselElem => {
        try {
            let reveal = new WordReplace(carouselElem)
            /* Use on click instead */
            // carouselElem.querySelector('.c-button-count').addEventListener('click', reveal.reveal.bind(reveal))
            return reveal
        } catch (e) {
            console.log(e)
        }
    })
} // *** End of WordReplace script ***




window.addEventListener('DOMContentLoaded', function(){
        const reveal = wordReplace()[0]
        reveal.reveal()
})