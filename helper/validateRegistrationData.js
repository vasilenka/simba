module.exports = user => {

  let {idUrl, address, longitude, latitude, gender, birthDate} = user

  if(!idUrl || !address || !longitude || !latitude || !gender || !birthDate) {
    return false
  }

  return true

}