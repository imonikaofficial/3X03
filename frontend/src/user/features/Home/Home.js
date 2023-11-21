import React from "react";
import { Layout, Carousel, Row, Col, Card, Button } from 'antd';
import { CarOutlined, DollarCircleOutlined, CalendarOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Meta } = Card;

const carData = [
  // Your car catalog data here...
];

const Home = () => {

  return (
    <Layout className="layout">
      <Content>
        <div className="slider-container">
          <Carousel autoplay>
            <div className="slide-item">
              <img src="https://images.pexels.com/photos/4055176/pexels-photo-4055176.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Car 1" />
            </div>
            <div className="slide-item">
              <img src="https://images.pexels.com/photos/4055176/pexels-photo-4055176.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Car 1" />
            </div>
            <div className="slide-item">
              <img src="https://images.pexels.com/photos/4055176/pexels-photo-4055176.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Car 1" />
            </div>
          </Carousel>
        </div>
        <div className="reasons-container py-6">
          <Row gutter={32} justify="center">
            <Col span={8}>
              <Card className="reason-card" style={{ background: '#ffcc00' }}>
                <CarOutlined className="reason-icon" style={{ fontSize: '36px', color: 'white' }} />
                <h2 style={{ color: 'white' }}>Wide Selection</h2>
                <p style={{ color: 'white' }}>Choose from a variety of car models to suit your needs.</p>
              </Card>
            </Col>
            <Col span={8}>
              <Card className="reason-card" style={{ background: '#ff6666' }}>
                <DollarCircleOutlined className="reason-icon" style={{ fontSize: '36px', color: 'white' }} />
                <h2 style={{ color: 'white' }}>Competitive Prices</h2>
                <p style={{ color: 'white' }}>Enjoy affordable rental rates and discounts for longer bookings.</p>
              </Card>
            </Col>
            <Col span={8}>
              <Card className="reason-card" style={{ background: '#3399ff' }}>
                <CalendarOutlined className="reason-icon" style={{ fontSize: '36px', color: 'white' }} />
                <h2 style={{ color: 'white' }}>Easy Booking</h2>
                <p style={{ color: 'white' }}>Book your car online or through our mobile app in minutes.</p>
              </Card>
            </Col>
          </Row>
        </div>
        <div className="car-catalog py-6">
          <Row gutter={16}>
            {carData.map((car) => (
              <Col span={8} key={car.id}>
                <Card
                  hoverable
                  cover={<img alt={`${car.make} ${car.model}`} src={car.image} />}
                >
                  <Meta title={`${car.make} ${car.model}`} />
                  <Button type="primary" className="mt-2">
                    View Details
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Content>
      <Footer className="text-center bg-gray-200 p-2">Car Rental ©2023</Footer>
    </Layout>
  );
};

export default Home;
