<script>
    import { dev } from "$app/environment";
    import { Container, Row, Col, NavLink } from '@sveltestrap/sveltestrap';

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
        <strong>Front-End: </strong>
        <Col>
            <ul>
                <li><NavLink href="/movies-dataset">movies-dataset</NavLink></li>
                <li><NavLink href="/ufc-events-data">ufc-events-data</NavLink></li>
                <li><NavLink href="/youtube-trends">youtube-trends</NavLink></li>
            </ul>
        </Col>
    </Row>
    <Row>
        <strong>APIs Base: </strong>
        <Col>
            <ul>
                <li><NavLink href="/api/v1/movies-dataset">movies-dataset</NavLink></li>
                <li><NavLink href="/api/v1/ufc-events-data">ufc-events-data</NavLink></li>
                <li><NavLink href="/api/v2/ufc-events-data">ufc-events-data</NavLink></li>
                <li><NavLink href="/api/v1/youtube-trends">youtube-trends</NavLink></li>
            </ul>
        </Col>
    </Row>
    
    <Row>
        <Col><strong>URL:</strong> <NavLink href="https://sos2324-14.appspot.com">https://sos2324-14.appspot.com</NavLink></Col>
    </Row>
    <Row>
        <strong>Documentación:</strong>
        <Col>
            <ul>
                <li><NavLink href="{BASE}/api/v1/movies-dataset/docs">/api/v1/movies-dataset/docs (developed by Enrique García Olivares)</NavLink></li>
                <li><NavLink href="https://documenter.getpostman.com/view/32992444/2sA2xh3tEg">/api/v1/ufc-events-data/docs (developed by Nicolás Redondo Moreno)</NavLink></li>
                <li><NavLink href="https://documenter.getpostman.com/view/32992444/2sA35LWzXn">/api/v2/ufc-events-data/docs (developed by Nicolás Redondo Moreno)</NavLink></li>
                <li><NavLink href="{BASE}/api/v1/youtube-trends/docs">/api/v1/youtube-trends/docs (developed by Víctor Escalera García)</NavLink></li>
            </ul>
        </Col>
    </Row>
    <Row>
        <Col><strong>Repository:</strong> <NavLink href="https://github.com/gti-sos/SOS2324-14">gti-sos/SOS2324-14</NavLink></Col>
    </Row>
    <Row>
        <strong>Team:</strong>
        <Col>
            <ul>
                <li><NavLink width="20px" href="https://github.com/enrgaroli">Enrique García Olivares - <a href="https://docs.google.com/spreadsheets/d/1w-PwFC-4Cl3YDFELyqrB9bi7eR_ZPIYnrHOx83KctC8/edit#gid=696240695">movies-dataset</a></NavLink></li>
                <li><NavLink width="20px" href="https://github.com/NicoRedondoo">Nicolás Redondo Moreno - <a href="https://docs.google.com/spreadsheets/d/1w-PwFC-4Cl3YDFELyqrB9bi7eR_ZPIYnrHOx83KctC8/edit#gid=1179082162">ufc-events-data</a></NavLink></li>
                <li><NavLink width="20px" href="https://github.com/victorsclr">Víctor Escalera García - <a href="https://docs.google.com/spreadsheets/d/1w-PwFC-4Cl3YDFELyqrB9bi7eR_ZPIYnrHOx83KctC8/edit#gid=723179599">youtube-trends</a></NavLink></li>
            </ul>
        </Col>
    </Row>
</Container>