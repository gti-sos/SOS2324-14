<script lang="ts">
    import { Container, Row, Col, Nav, NavItem, Dropdown, DropdownItem, DropdownToggle, DropdownMenu, NavLink} from '@sveltestrap/sveltestrap';

    let isOpen = false;
</script>
<Container>
  <Row>
    <Nav underline>
      <Col xs=1>
        <NavItem>
          <NavLink href="/" >Home</NavLink>
        </NavItem>
      </Col>
      <Col xs=1>
        <Dropdown nav {isOpen} toggle={() => (isOpen = !isOpen)}>
          <DropdownToggle nav caret>APIs</DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Nombres</DropdownItem>
            <DropdownItem href="/movies-dataset">movies-dataset</DropdownItem>
            <DropdownItem href="/ufc-events-data">ufc-events-data</DropdownItem>
            <DropdownItem href="/youtube-trends">youtube-trends</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Col>
      <Col xs=1>
        <NavItem>
          <NavLink href="/about">About</NavLink>
        </NavItem>
      </Col>
    </Nav>
  </Row>
</Container>



