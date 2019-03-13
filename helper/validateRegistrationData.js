module.exports = user => {

  let idUrl = user.idUrl
  let address = user.address
  let longitude = user.longitude
  let latitude = user.latitude
  let gender = user.gender
  let birthDate = user.birthDate

  // console.log("ID: ", idUrl)
  // console.log("ADDRESS: ", address)
  // console.log("LNG: ", longitude)
  // console.log("LAT: ", latitude)
  // console.log("GENDER: ", gender)
  // console.log("BIRTDATE: ", birthDate)

  if(!idUrl || !address || !longitude || !latitude || !gender || !birthDate) {
    // console.log('NOT COMPLETE!')
    return false
  }

  // console.log('COMPLETE!')
  return true

}