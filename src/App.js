import { Button, CardFooter, Spinner, Input, Label } from 'reactstrap';
import { Navbar, NavbarBrand } from 'reactstrap';
import { Card, CardBody, CardHeader, CardImg} from 'reactstrap';
import React, {useState, useEffect} from "react";
import axios from 'axios';
import { BsHeartFill, BsHeart } from "react-icons/bs";
import { toast, ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const ImageCard = ({data}) => {
  const [like, setLike] = useState(false)
  const roverText = data.rover.status === 'active' ? 'still active' : 'no longer active'

  return (
    <div className="col-12 col-md-5 col-lg-4 mb-3">
      <Card>
        <CardHeader>Picture taken by {data.camera.full_name}</CardHeader>
        <CardImg style = {{height: '50vh'}} src = {data.img_src} alt={`Image taken by ${data.camera.full_name}`}/>
        <CardBody>Image taken by: {data.rover.name} on {data.earth_date}. The rover is {roverText}</CardBody>
        <Button className='auto m-2' onClick={() => setLike(!like)} color = {like? 'danger':'dark'}>
          {like ?  <>Liked <BsHeartFill/> </>: <>Like <BsHeart/> </>}
        </Button>
        <CardFooter>{data.rover.name} was launched on {data.rover.launch_date}.</CardFooter>
      </Card>
    </div>
  )

}

function App() {
  const [data, setData] = useState([])
  const [fetched, setFetch] = useState(false)
  const [earthDate, setEarthDate] = useState(null)

  const resetData = () => {
    setFetch(false)
    axios
    .get(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=100&api_key=${process.env.REACT_APP_NASA}`).then(response => {
      setData(response.data.photos);
      setFetch(true)
    }).catch(err => {
      toast.error('Could not fetch data. API key may be expired')
    })
  }

  const fetchDate = () => {
    setFetch(false)
    if(earthDate === null){
      toast.error('Please enter a date')
      setFetch(true)
      return
    }

    axios
    .get(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${earthDate}&api_key=${process.env.REACT_APP_NASA}`).then(response => {
        if(response.data.photos.length > 0) {
          toast.success('Date successfully fetched')
          setData(response.data.photos);
        } else {
          toast.error('There are no photos for this date')
        } 
    }).catch(err => {
      toast.error('Could not fetch data for the date entered.')
    })
    setFetch(true)
  }

  useEffect(() => {
    axios
      .get(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=100&api_key=${process.env.REACT_APP_NASA}`).then(response => {
        setData(response.data.photos);
        setFetch(true)
      })
  }, [])

  return (
    <div className="App">
      <ToastContainer draggable={false} transition={Zoom} position='top-center' autoClose={2000}/>
      <div className='container'>
        <Navbar color="faded" light>
          <NavbarBrand href="/" className="mr-auto">NASA APOD API</NavbarBrand>
          <Button onClick = {resetData}>{fetched ? 'Fetch Again' : 'Fetching Data'}</Button>
        </Navbar>
        
          {fetched ? 
            <div>
              <div className='mb-3'>                
                  <Label for='date'>Filter by Date</Label>
                  <Input className='col-5' type = 'date' name = 'date' onChange={(e) => setEarthDate(e.target.value)}></Input>
                  <Button className='col-12 m-1' onClick={fetchDate}>Filter</Button>
              </div>

              <div className='row justify-content-center'>
                {
                  data.map(d => {
                      return (<ImageCard  key = {d.id} data = {d} /> )
                  })
                }
              </div>
            </div>
             : 
             <div className='d-flex align-items-center justify-content-center' style={{height: '90vh'}}>
              <Spinner type="grow" style={{ width: '20rem', height: '20rem', verticalAlign:'middle'}} className='col-8 mr-2 ml-2'/>
             </div>  
          }      
      </div>
    </div>
  );
}

export default App;
