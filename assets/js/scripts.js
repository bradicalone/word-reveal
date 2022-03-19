window.onload = function () {
    wordReplace()
}

function WordReplace(main) {
    
    // Cache / State
    const headers = main.querySelectorAll('[data-word-index]')
    const svgPaths = Array.from(document.querySelectorAll('.st0-logo-letter')).reverse()
    const svgDecorations = Array.from(document.querySelectorAll('.dodads > *'))
    const xmlns = "http://www.w3.org/2000/svg";
    let shown = false
    let header_data = []
    /* Not enough items will print error message */
    // if (current_header_length < 3) return false
    // return
    const getTransformOrigin = (svg) => {
        const [x, y, width, height] = svg.getAttribute('viewBox').split(' ')
        const children = svg.children

        Array.from(children).forEach(child => {
            const {x, y, width, height} = child.getBBox()
            child.style.transformOrigin = (x + width / 2)+'px ' + (y + height / 2)+'px' 

        })
        
    }
    loadLetters()
        const observe = function (inView) {
            if (inView && !shown) {
                
            }
        }
       
        function loadLetters() {
            let i = headers.length

            while (i--) {
                const step = headers[i].dataset.wordIndex
                
                if(step == 1) {
                    const nextElementHeight =  headers[i].parentNode.getBoundingClientRect().height

                    header_data[0] = { 
                        height: nextElementHeight,
                        el: headers[i], 
                        text: false
                    }
                }
                else if(step == 2) {
                    
                    /* Svg elements */
                    if(headers[i].tagName === 'svg') {
                        getTransformOrigin(headers[i])
                        const svg_height = Number(headers[i].getAttribute('viewBox').split(' ')[3])
                        const g = document.createElementNS(xmlns, "g");
                        g.classList.add("header--word")
                        const header_text = svgPaths.map(path => g.appendChild(path))
                        
                        headers[i].appendChild(g)

                        // If array doesn't have any data makes a new array to add data too
                        if(  !header_data[1] ) header_data[1] = []
                        header_data[1].unshift({ height: svg_height, el: headers[i], letters: header_text })

                    /* Dom elements */
                    } else {
                        const header_text = headers[i].textContent.split(/\s+/).map((word) => {
                            return '<div class="header--word">'+' <span>' + word.split('').join('</span><span>') + '</span>'+'</div>&nbsp;'
                        }).join('')
    
                        headers[i].innerHTML = header_text

                        /* Get new height of items in the DOM */
                        const newHeight = headers[i].getBoundingClientRect().height
                    
                        // If array doesn't have any data makes a new array to add data too
                        if( !header_data[1]) header_data[1] = []
                        header_data[1].unshift({ height: newHeight, el: headers[i], letters: headers[i].querySelectorAll('.header--word span') })

                    }
                    
                } else if(step == 3) {
                    // last step either push to header_data array here,  or loop through just selector elements in the animate
                }
            }

            console.log('header_data:', header_data)
            // callback()
        }
        this.reveal = function (e) {
            let index = 0
            let wordIndex = 0
            const animate = () => {
                const headerObj = header_data[index]

                if(index === 0) {
                    headerObj.el.style.transform = 'translate(-50%, '+headerObj.height+'px)'
                    // headerObj.el.style.opacity = 0
                    headerObj.el.addEventListener('transitionend', e => {

                        e.target.style.opacity = 0
                        index++
                        animate()
                    })
                } else if (index === 1 ) {
                    let letters = headerObj[wordIndex].letters
                    let lettersLength = letters.length
    
                    // Adjust number if wordIndex true for dodads to display fast or delay at the end
                    const transitionElem = headerObj.length - 1 == wordIndex ? 4 : lettersLength - 1

                    for(let i = lettersLength-1; i >= 0; i--) {
          
                        setTimeout(() => {
                            letters[i].style.transform = 'translate(0, 0%) rotate(0deg)'
                        }, i * 60)
                    }
           
                    // Start next line of animations when last letter is done animating
                    letters[transitionElem].addEventListener('transitionend', e => {
                       
                            headerObj[wordIndex].el.style.overflow = 'visible'
                            wordIndex++

                        // Stops at the last word
                        if(headerObj[wordIndex]) {
                            animate()
                        } else {
                            index++
                            animate()
                        }
                    })
                } else if (index === 2 ) {
                    for(let i = svgDecorations.length-1; i >= 0; i--) {
                        let tagName = svgDecorations[i].tagName
                        
                        setTimeout(() => {
                            if( tagName === 'line'  ) {
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

}


function wordReplace() {

    /* Word__Reveals to Load */
    const sections = document.querySelectorAll('.Word__Reveal')
    console.log('sections:', sections)

    /* Loops through all the sections on the page */
    sections.forEach(carouselElem => {

        try {
            let reveal = new WordReplace(carouselElem)
            console.log('reveal:', reveal.reveal())

            const observer = new ResizeObserver(entries => {
                // carousel.observe(entries)
            })
            observer.observe(document.body)


            // console.log(carouselElem.querySelector('.c-button-count'))
            // carouselElem.querySelector('.c-button-count').addEventListener('click', reveal.reveal.bind(reveal))

        } catch (e) {
            console.log( e)
        }
    })
} // *** End of WordReplace script ***




