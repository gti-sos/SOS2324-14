<script>
    import { dev } from "$app/environment";
    import { Container, Row, Col, ListGroup, ListGroupItem, Nav, NavLink } from '@sveltestrap/sveltestrap';

    let BASE = "";

    if(dev)
        BASE = "http://localhost:10002"+BASE
</script>
<Container>
    <h1>SOS2324-14</h1><hr>
    <Row>
        <Col><strong>Project Description:</strong> Our information sources are aimed at analyzing the reach of different ways of entertainment in the world.</Col>
    </Row>
    <Row>
        <Col xs=6>
            <ListGroup> 
                <ListGroupItem color="info">
                    <strong>Front-End: </strong>
                </ListGroupItem>
                <ListGroupItem tag="a" href="/movies-dataset" action>
                    movies-dataset
                </ListGroupItem>
                <ListGroupItem tag="a" href="/ufc-events-data" action>
                    ufc-events-data
                </ListGroupItem>
                <ListGroupItem tag="a" href="/youtube-trends" action>
                    youtube-trends
                </ListGroupItem>
            </ListGroup>
        </Col>
        <Col xs=6>
            <ListGroup> 
                <ListGroupItem color="info">
                    <strong>APIs Base: </strong>
                </ListGroupItem>
                <ListGroupItem tag="a" href="/api/v1/movies-dataset" action>
                    movies-dataset
                </ListGroupItem>
                <ListGroupItem tag="a" href="/api/v1/ufc-events-data" action>
                    ufc-events-data
                </ListGroupItem>
                <ListGroupItem tag="a" href="/api/v1/youtube-trends" action>
                    youtube-trends
                </ListGroupItem>
            </ListGroup>
        </Col>
    </Row>
    <Row>
        <Col><strong>URL:</strong> <NavLink href="https://sos2324-14.appspot.com">https://sos2324-14.appspot.com</NavLink></Col>
    </Row>
    <Row>
        <Col><strong>Repository:</strong> <NavLink href="https://github.com/gti-sos/SOS2324-14">gti-sos/SOS2324-14</NavLink></Col>
    </Row>
    <Row>
        <Col xs=6>
            <ListGroup> 
                <ListGroupItem color="info">
                    <strong>Documentación:</strong>
                </ListGroupItem>
                <ListGroupItem tag="a" href="{BASE}/api/v1/movies-dataset/docs" action>
                    /api/v1/movies-dataset/docs (developed by Enrique García Olivares)
                </ListGroupItem>
                <ListGroupItem tag="a" href="https://documenter.getpostman.com/view/32992444/2sA2xh3tEg" action>
                    /api/v1/ufc-events-data/docs (developed by Nicolás Redondo Moreno)
                </ListGroupItem>
                <ListGroupItem tag="a" href="{BASE}/api/v1/youtube-trends/docs" action>
                    /api/v1/youtube-trends/docs (developed by Víctor Escalera García)
                </ListGroupItem>
            </ListGroup>
        </Col>
        <Col xs=6>
            <ListGroup> 
                <ListGroupItem color="info">
                    <strong>Team:</strong>
                </ListGroupItem>
                <ListGroupItem>
                    <Nav>
                        <NavLink href="https://github.com/enrgaroli">Enrique García Olivares</NavLink>
                        _
                        <NavLink href="https://docs.google.com/spreadsheets/d/1w-PwFC-4Cl3YDFELyqrB9bi7eR_ZPIYnrHOx83KctC8/edit#gid=696240695">movies-dataset</NavLink>
                    </Nav>    
                </ListGroupItem>
                <ListGroupItem>
                    <Nav>
                        <NavLink href="https://github.com/NicoRedondoo">Nicolás Redondo Moreno</NavLink>
                        _
                        <NavLink href="https://docs.google.com/spreadsheets/d/1w-PwFC-4Cl3YDFELyqrB9bi7eR_ZPIYnrHOx83KctC8/edit#gid=1179082162">ufc-events-data</NavLink>
                    </Nav>    
                </ListGroupItem>
                <ListGroupItem>
                    <Nav>
                        <NavLink href="https://github.com/victorsclr">Víctor Escalera García</NavLink>
                        _
                        <NavLink href="https://docs.google.com/spreadsheets/d/1w-PwFC-4Cl3YDFELyqrB9bi7eR_ZPIYnrHOx83KctC8/edit#gid=723179599">youtube-trends</NavLink>
                    </Nav>    
                </ListGroupItem>
            </ListGroup>
        </Col>
    </Row>
</Container>