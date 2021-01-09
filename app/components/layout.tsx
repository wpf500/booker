import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Link from "next/link";
import { useRouter } from "next/router";

function NavLink({ label, href }: { label: string; href: string }) {
  const router = useRouter();

  return (
    <Link href={href}>
      <Nav.Link href={href} active={router.asPath === href}>
        {label}
      </Nav.Link>
    </Link>
  );
}

export default function Layout({
  children,
  home,
}: {
  children: React.ReactNode;
  home?: boolean;
}) {
  const router = useRouter();
  router.asPath;

  return (
    <Container fluid="md" className="mt-4 mb-4">
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Navbar.Brand>Booker</Navbar.Brand>
        <Nav>
          <NavLink href="/" label="Overview" />
          <NavLink href="/income" label="Income" />
          <NavLink href="/expenses" label="Expenses" />
          <NavLink href="/children" label="Children" />
        </Nav>
      </Navbar>
      {children}
    </Container>
  );
}
