import React from 'react'
import { connect } from 'react-redux';
import geocoder from 'geocoder'
import { Button, Form, Dimmer, Loader, Image, Segment, Grid } from 'semantic-ui-react'
import { findVenueById } from '../helpers/findVenueById'
import { setCurrentVenues, editVenueAction, editVenue } from '../actions/venues.js'


const DEFSPECIALS = [{day: "Sunday", special: "", time: ""}, {day: "Monday", special: "", time: "" }, {day: "Tuesday", special: "", time: ""}, {day: "Wednesday", special: "", time: ""}, {day: "Thursday", special: "", time: ""}, {day: "Friday", special: "", time: ""}, {day: "Saturday", special: "", time: ""}]

class Edit extends React.Component {

  state = {
    venueId: null,
    name: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    neighborhood: '',
    number: '',
    specials: [{day: "Sunday", special: "", time: ""}, {day: "Monday", special: "", time: "" }, {day: "Tuesday", special: "", time: ""}, {day: "Wednesday", special: "", time: ""}, {day: "Thursday", special: "", time: ""}, {day: "Friday", special: "", time: ""}, {day: "Saturday", special: "", time: ""}],
    latitude: '',
    longitude: ''
  }


  getSpecialsDetails = () => {
    return this.state.specials.map((special, idx) => {
      return (
        <div key={idx}>
          <Form.Field >
            <label>{special.day}&#39;s Special</label   >
            <input type="text" onChange={(e) => this.handleSpecialChange(special.day, e)} value={special.special} />
          </Form.Field>
          <Form.Field>
            <label>{special.day}&#39;s Happy Hour Time</label>
            <input type="text" onChange={(e) => this.handleTimeChange(special.day, e)} value={special.time} />
          </Form.Field>
        </div>
      )
    })

  }

  handleTimeChange = (day, event) => {
    console.log("time change", event.target.value)
    if(this.state.specials.length) {
      console.log('POOP');
      const newTime = this.state.specials.map(special => {
        console.log("time", special.time)
        if(special.day === day){
          return Object.assign({}, special, {time: event.target.value})
        } else {
          return special
        }
      })
      console.log("newTime", newTime)
      this.setState({
        specials: newTime
      }, () => { console.log('state', this.state) })
    }
  }

  handleSpecialChange = (day, event) => {
    console.log("special change", event.target.value)
    if(this.state.specials.length){
      const newSpecials = this.state.specials.map(special => {
        if(special.day === day){
          return Object.assign({}, special, {special: event.target.value})
        } else {
          return special
        }
      })
      this.setState({
        specials: newSpecials
      })
    }
  }

  handleInputChange = (input, value) => {
    this.setState({
      [input]: value
    })
  }

  setVenueData = (id, venues) => {
    const venue = findVenueById(parseInt(id, 10), venues)
    console.log("this venue", venue.id)
    this.props.setCurrentVenues([venue])

    const updatedSpecials = this.state.specials.map(special => {
      const specialToUpdate = venue.specials.find(sp => sp.day === special.day)
      if (specialToUpdate) {
        return specialToUpdate
      } else {
        return special
      }
    })


    this.setState({
      venueId: venue.id,
      name: venue.venue_name,
      address: venue.address,
      city: venue.city,
      state: venue.state,
      zipcode: venue.zipcode,
      // specials: (venue.specials.length > 0) ? venue.specials : DEFSPECIALS,
      specials: updatedSpecials,
      neighborhood: venue.neighborhood,
      number: venue.phone_number,
    })
  }

  componentDidMount() {
    if(this.props.venues.length > 0)
      this.setVenueData(this.props.match.params.id, this.props.venues)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.venues.length > 0) {
      console.log("logged venues", nextProps.venues)
      this.setVenueData(this.props.match.params.id, nextProps.venues)
    }
  }

  handleEditSubmit = () => {
    const address = `${this.state.address} ${this.state.city}, ${this.state.state} ${this.state.zipcode}`
    console.log("address", address)
    return geocoder.geocode(address, (err, data) => {
      if(data.status === "OK"){
        data.results.forEach(result => {
          const lat = result.geometry.location.lat;
          const lng = result.geometry.location.lng;
          console.log("latitude", lat)
          this.setState({
            latitude: lat,
            longitude: lng,
          })
        })
        const editVenueObj = {
          venue_name: this.state.name,
          address: this.state.address,
          city: this.state.city,
          state: this.state.state,
          zipcode: this.state.zipcode,
          phone_number: this.state.number,
          neighborhood: this.state.neighborhood,
          latitude: this.state.latitude,
          longitude: this.state.longitude,
          specials: this.state.specials,
        }
        console.log("editVenueObj", editVenueObj)
        return this.props.editVenueAction(editVenueObj)

      } else {
        return alert("Address is invalid. Please try again!")
      }
    })
  }

  render(){
    if(this.state.venueId){
      return(
        <Grid className="edit-listing-form">
          <Grid.Row>
          <Grid.Column width={2}>
          </Grid.Column>
            <Grid.Column width={12}>
              <Form><h1 className="edit-form-heading">Edit This Listing!</h1>
                <Form.Field>
                  <label>Venue Name</label>
                  <input onChange={(e) => this.handleInputChange("name", e.target.value)} value={this.state.name} />
                </Form.Field>
                <Form.Field>
                  <label>Venue Address</label>
                  <input onChange={(e) => this.handleInputChange("address", e.target.value)} value={this.state.address} />
                </Form.Field>
                <Form.Field>
                  <label>City</label>
                  <input onChange={(e) => this.handleInputChange("city", e.target.value)} value={this.state.city} />
                </Form.Field>
                <Form.Field>
                  <label>State</label>
                  <input onChange={(e) => this.handleInputChange("state", e.target.value)} value={this.state.state} />
                </Form.Field>
                <Form.Field>
                  <label>Zipcode</label>
                  <input onChange={(e) => this.handleInputChange("zipcode", e.target.value)} value={this.state.zipcode} />
                </Form.Field><Form.Field>
                  <label>Neighborhood</label>
                  <input onChange={(e) => this.handleInputChange("neighborhood", e.target.value)} value={this.state.neighborhood} />
                </Form.Field>

                <Form.Field>
                  <label>Phone Number</label>
                  <input onChange={(e) => this.handleInputChange("number", e.target.value)} value={this.state.number} />
                </Form.Field>
                {this.getSpecialsDetails()}
                <Button onClick={this.handleEditSubmit} type='submit'>Edit</Button>
              </Form>
          </Grid.Column>
          <Grid.Column width={2}>
          </Grid.Column>
        </Grid.Row>
        </Grid>
      )
    }
    return (
      <Segment className="loading-icon">
        <Dimmer active inverted>
          <Loader size='massive'>Loading</Loader>
        </Dimmer>
        <Image src='/assets/images/wireframe/short-paragraph.png' />
      </Segment>
    )
  }
}

function mapStateToProps(state) {
  return ({
    venues: state.venues,
  })
}

// const mapDispatchToProps = (dispatch) => {
//   return({
//     setCurrentVenues: (sortedVenues) => { dispatch(setCurrentVenues(sortedVenues)) }
//   })
// }

const mapDispatchToProps = {
  setCurrentVenues,
  editVenueAction,
  editVenue
}

export default connect(mapStateToProps, mapDispatchToProps)(Edit)
