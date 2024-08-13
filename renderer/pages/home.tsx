import Link from 'next/link'

export default function HomePage() {

	return (
		<div>
			<Link href={"/search"}>Pesquisa</Link>
		</div>
	)
}
