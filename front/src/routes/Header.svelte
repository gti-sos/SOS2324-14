<script lang="ts">
    import {Nav, NavItem, Dropdown, DropdownItem, DropdownToggle, DropdownMenu, NavLink} from '@sveltestrap/sveltestrap';

    let isOpen = false;
</script>

<Nav underline>
    <NavItem>
      <NavLink href="/" >Home</NavLink>
    </NavItem>
    <Dropdown nav {isOpen} toggle={() => (isOpen = !isOpen)}>
      <DropdownToggle nav caret>APIs</DropdownToggle>
      <DropdownMenu>
        <DropdownItem header>Nombres</DropdownItem>
        <DropdownItem href="/movies-dataset">movies-dataset</DropdownItem>
        <DropdownItem href="/ufc-events-data">ufc-events-data</DropdownItem>
        <DropdownItem href="/youtube-trends">youtube-trends</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <NavItem>
      <NavLink href="/about">About</NavLink>
    </NavItem>
</Nav>


