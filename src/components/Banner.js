/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Container, Row, Col } from "react-bootstrap";
import { ArrowRightCircle } from 'react-bootstrap-icons';
import TrackVisibility from 'react-on-screen';

export const Banner = () => {
  return (
    <section className="banner" id="home">
      <div className="overlay">
      <Container>
        <Row className="align-items-center text-center">
          <Col xs={12}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                  <span className=" text-3xl mt-10">EMERGENCY HELPING SERVICE</span>
                  <h1 className=" text-8xl  mt-10 mb-10">Urgent AI</h1>
                  <p className="text-3xl mb-10">For the whole Nation</p>
                  <div className="flex justify-center ">
                      <button className=" mr-5" onClick={() => console.log('connect')}>
                        Victim <ArrowRightCircle color="red" size={25} />
                      </button>
                      <button className="" onClick={() => console.log('connect')}>
                        Police <ArrowRightCircle color="blue" size={25} />
                      </button>
                    </div>                </div>
              )}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
      </div>
    </section>
  );
};
