// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FELURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    vaccinationData :{},
  }

  componentDidMount() {
    this.getVaccinationData()
  }

 

  getVaccinationData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const vaccinationDataApiUrl = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(vaccinationDataApiUrl)
    if (response.ok === true){
      const fetchedData = await response.json()
      const updatedData = {
        last7DaysVaccination :fetchedData.last_7_days_vaccination.map(eachDayData=>({
          vaccineData :eachDayData.vaccine_date,
          dose1:eachDayData.dose_1,
          dose2 :eachDayData.dose2,
        }),
        ),
        vaccinationByAge :fetchedData.vaccination_by_age.map(range=>({
          age:range.age,
          count :range.count,
        })),
        vaccinationByGender :fetchedData.vaccination_by_gender.map(genderType=>({
          gender :genderType.gender,
          count :genderType.count,
        })),
      }
      this.setState({
        vaccinationData:updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderAllVaccineDetails = () => {
    const {vaccinationData} = this.state
    return (
      <>
       <VaccinationCoverage data={vaccinationData.last7DaysVaccination} />
      <VaccinationByGender data={vaccinationData.vaccinationByGender} />
      <VaccinationByAge data={vaccinationData.vaccinationByAge} />
    </>
    )
  }

  

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Something Went Wrong</h1>
    </div>
  )

  renderLoader = () => (
    <div data-testid="loader" className="loader-view">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  

  renderSuccesFailure = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderAllVaccineDetails()
      default :
        return null
    }
  }

  render() {
    return (
      <div className="app-bg-container">
        <nav className="nav-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="website-logo"
          />
          <h1 className="web-heading">Co-WIN</h1>
        </nav>
        <h1 className="vaccination-heading">CoWIN Vaccination in India</h1>
        {this.renderSuccesFailure()}
      </div>
    )
  }
}
export default CowinDashboard
