import { useState, Dispatch, SetStateAction }from 'react'
import YTSearch from '../scripts/YTSearch'

export default function HomePage() {

	const [videos, setVideos] = useState([])

	return (
		<div>
			<div>
				<input id='SearchInput' placeholder='Coloque aqui oq deseja pesquisar' />
				<button onClick={() => onclick(setVideos)}>OLA</button>

				<div className="videos-container">
					{videos.map((value, index) => (
						<div className='video-container' key={index}>
							<div className='thumbnail-container'>
								<img className='thumbnail-video' src={`${value.thumbnail}`} alt={`image_video`} />
								<div className='time-thumb-video'>
									<span>{value.durationFormatted}</span>
								</div>
							</div>
							<div className='information-video'>
								<h4 className='title-video'>{value.title}</h4>
								<div>
									<div className='channel-name-verified'>
										<h5>{value.channel.name}</h5>
										{(value.channel.verified) ? <span><img src="/svgs/verified.svg" alt="" /></span> : ""}
									</div>
									<div className='channel-name-verified'>
										<h5>{formatViews(value.views)}&nbsp;</h5>
										<span>•</span>
										<h5>{value.uploadedAt}</h5>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

async function onclick(videoState: Dispatch<SetStateAction<any[]>>) {

	const input: any = document.getElementById("SearchInput")

	const videos = await new YTSearch(input.value).request()

	videoState(videos.arrayVideos)

}

function formatViews(views: number) {
	const stringView = String(views)
	if (views >= 1000 && views < 9999) {
		return `${stringView[0]} mil visualizações`
	} else if (views >= 10000 && views < 999999) {
		return `${stringView.slice(0, 2)} mil visualizações`
	} else if (views >= 1000000 && views < 999999999) {
		return `${stringView[0]}${(stringView[1] != "0")? `,${stringView[1]}`: ""} mi visualizações`
	} else if (views >= 1000000000 && views < 9999999999) {
		return `${stringView[0]}${(stringView[1] != "0")? `,${stringView[1]}`: ""} bi visualizações`
	} else {
		return `${stringView} visualizações`
	}
}
