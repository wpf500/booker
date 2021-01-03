import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Link from 'next/link';

export default function Layout({children, home}: {children: React.ReactNode, home?: boolean}) {
  return (
    <Container fluid="md" className="mt-4 mb-4">
      {!home &&
        <Link href="/">
          <Button size="sm" variant="outline-primary" className="mb-4">← Back to home</Button>
        </Link>}
      {children}
    </Container>
  )
}
