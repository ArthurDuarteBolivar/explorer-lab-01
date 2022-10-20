import "./css/index.css"
import IMask from "imask"

const btn = document.querySelector("form > button")

const ccHolder = document.querySelector(".cc-holder .value")

const cardHolder = document.querySelector("#card-holder")

const body = document.querySelector("body")

const ccBgColor1 = document.querySelector(
  "#app > section > div.cc-bg > svg > g > g:nth-child(2) > path"
)
const ccBgColor2 = document.querySelector(
  "#app > section > div.cc-bg > svg > g > g:nth-child(1) > path"
)
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")
ccBgColor1.setAttribute("fill", "green")
ccBgColor2.setAttribute("fill", "blue")

function setCardType(type) {
  if (type) {
    const colors = {
      visa: ["#436D99", "#2D57F2"],
      mastercard: ["#DF6F29", "#C69347"],
    }
    ccBgColor1.setAttribute("fill", colors[type][0])
    ccBgColor2.setAttribute("fill", colors[type][1])
    ccLogo.setAttribute("src", `cc-${type}.svg`)
  } else {
    ccBgColor1.setAttribute("fill", "black")
    ccBgColor2.setAttribute("fill", "gray")
    ccLogo.setAttribute("src", `cc-default.svg`)
  }
  if (type == "visa") {
    body.style.backgroundImage =
      "linear-gradient(to left, #0000ff, #add8e6, #0000ff )"
  } else if (type == "mastercard") {
    body.style.backgroundImage =
      "linear-gradient(to left, #b8860b , #daa100, #b8860b )"
  }
}

globalThis.setCardType = setCardType

const securityCode = document.querySelector("#security-code")
const securityCodePatter = {
  mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePatter)

const expirationDate = document.querySelector("#expiration-date")
const expirationDatePatter = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePatter)

const cardNumber = document.querySelector("#card-number")
const cardNumberPatter = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })
    return foundMask
  },
}

const cardNumberMasked = IMask(cardNumber, cardNumberPatter)

btn.addEventListener("click", () => {
  console.log("clicou")
})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})
cardHolder.addEventListener("input", () => {
  ccHolder.innerText =
    cardHolder.value.length === 0 ? "Fulano da Silva" : cardHolder.value
})

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = code.length === 0 ? "123" : code
}
cardNumberMasked.on("accept", () => {
  const cardtype = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardtype)
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number === 0 ? "1234 5678 9012 3456" : number
}

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-extra .value")
  ccExpiration.innerText = date.length === 0 ? "02/32" : date
}
