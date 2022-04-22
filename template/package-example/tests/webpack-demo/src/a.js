function component() {
    const element = document.createElement("div")
  
    element.innerHTML = "Hello  webpack aaaa"
  
    return element
  }
  
  document.body.appendChild(component())
  