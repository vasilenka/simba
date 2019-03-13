module.exports = user => {

  let idUrl = user.idUrl
  let address = user.address
  let longitude = user.longitude
  let latitude = user.latitude
  let gender = user.gender
  let birthDate = user.birthDate

  if(!idUrl || !address || !longitude || !latitude || !gender || !birthDate) {
    return false
  }

  return true

}