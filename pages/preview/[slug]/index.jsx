import Container from '@/components/modules/container'
import TitleComponent from '@/components/modules/editorial/titleComponent'
import YoutubeComponent from '@/components/modules/editorial/youtubeComponent'
import Layout from '@/components/modules/layout'
import { useRef, useState } from 'react'
import swal from 'sweetalert'
import DragDrop from '@/components/dnd/DragDrop'
import SEO from '@/components/utils/seo'
import nookies from 'nookies'
import axios from 'axios'
import StackDrag from '@/components/dnd/StackDrag'
import { useEffect } from 'react'
import { scrollToTop } from '@/components/utils/scrollToTop'
import { useRouter } from 'next/router'
import StackDragDrop from '@/components/dnd/StackDragDrop'

export default function PreviewModul({
  user,
  userList,
  modul,
  seo,
  comments,
  modulId,
  token,
}) {

  useEffect(() => {
    scrollToTop()
  }, [])

  return (
    <Layout>
      <SEO
        title={modul.Title}
        defaultSEO={typeof seo !== 'undefined' && seo}
        webTitle={typeof seo !== 'undefined' && seo.Website_Title}
      />
      <div className="relative flex flex-col w-full pb-12 grow">
        <Container className="mt-4 md:mt-6 xl:mt-8">
          <div
            className="w-full max-w-4xl flex flex-col items-center mx-auto space-y-8"
          >
            {modul.Editor?.map((data, idComponent) =>
              data.__component === 'editor.title' ? (
                <TitleComponent
                  title={data.Title}
                  content={data.Content}
                  key={idComponent}
                />
              ) : data.__component === 'editor.youtube' ? (
                <YoutubeComponent link={data.Youtube} key={idComponent} />
              ) : data.__component === 'editor.content' ? (
                <div
                  key={idComponent}
                  data-id={idComponent + 1}
                  className="w-full flex flex-col space-y-3 editor"
                  dangerouslySetInnerHTML={{ __html: data.Content }}
                ></div>
              ) : data.type === 'drag-drop' ? (
                <div className="flex flex-col w-full" key={idComponent}>
                  <DragDrop dragDrop={data} idComponent={idComponent} />
                </div>
              ) : data.type === 'fill-left-answer' ? (
                <div
                  className="grid grid-cols-[2fr,1fr,2fr] grid-flow-col w-full border border-black"
                  key={idComponent}
                >
                  <div className="w-full border-r border-black h-full flex flex-col">
                    {data.question_and_answer.map((_, idLeft) =>
                      idLeft !== 0 ? (
                        <input
                          key={idLeft}
                          onKeyDown={(e) => (e.keyCode === 32 ? false : true)}
                          onChange={(e) =>
                            (e.target.value = e.target.value.replace(/\s/g, ''))
                          }
                          name={`${data.Name}_${idLeft + 1}`}
                          placeholder="..............."
                          className="w-full pl-3 py-1 border-t border-black placeholder:text-yellow-500 text-yellow-500 outline-none"
                        />
                      ) : (
                        <input
                          key={idLeft}
                          onKeyDown={(e) => (e.keyCode === 32 ? false : true)}
                          onChange={(e) =>
                            (e.target.value = e.target.value.replace(/\s/g, ''))
                          }
                          name={`${data.Name}_${idLeft + 1}`}
                          placeholder="..............."
                          className="w-full pl-3 py-1 placeholder:text-yellow-500 text-yellow-500 outline-none"
                        />
                      ),
                    )}
                  </div>
                  <div className="w-full flex justify-center items-center h-full">
                    <span>{data.Verb}</span>
                  </div>
                  <div className="w-full border-l border-black h-full flex flex-col">
                    {data.question_and_answer.map((item, idLeft) =>
                      idLeft !== 0 ? (
                        <div
                          key={idLeft}
                          className="w-full pl-3 py-1 border-t border-black"
                        >
                          {item.Question}
                        </div>
                      ) : (
                        <div key={idLeft} className="w-full pl-3 py-1">
                          {item.Question}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              ) : data.type === 'fill-right-answer' ? (
                <div
                  className="grid grid-cols-[2fr,1fr,2fr] grid-flow-col w-full border border-black"
                  key={idComponent}
                >
                  <div className="w-full border-r border-black h-full flex flex-col">
                    {data.question_and_answer.map((item, idRight) =>
                      idRight !== 0 ? (
                        <div
                          key={idRight}
                          className="w-full pl-3 py-1 border-t border-black"
                        >
                          {item.Question}
                        </div>
                      ) : (
                        <div key={idRight} className="w-full pl-3 py-1">
                          {item.Question}
                        </div>
                      ),
                    )}
                  </div>
                  <div className="w-full flex justify-center items-center h-full">
                    <span>{data.Verb}</span>
                  </div>
                  <div className="w-full border-l border-black h-full flex flex-col">
                    {data.question_and_answer.map((_, idRight) =>
                      idRight !== 0 ? (
                        <input
                          key={idRight}
                          name={`${data.Name}_${idRight + 1}`}
                          onKeyDown={(e) => (e.keyCode === 32 ? false : true)}
                          onChange={(e) =>
                            (e.target.value = e.target.value.replace(/\s/g, ''))
                          }
                          placeholder="..............."
                          className="w-full pl-3 py-1 border-t border-black placeholder:text-yellow-500 text-yellow-500 outline-none"
                        />
                      ) : (
                        <input
                          key={idRight}
                          name={`${data.Name}_${idRight + 1}`}
                          onKeyDown={(e) => (e.keyCode === 32 ? false : true)}
                          onChange={(e) =>
                            (e.target.value = e.target.value.replace(/\s/g, ''))
                          }
                          placeholder="..............."
                          className="w-full pl-3 py-1 placeholder:text-yellow-500 text-yellow-500 outline-none"
                        />
                      ),
                    )}
                  </div>
                </div>
              ) : data.type === 'arrange' ? (
                <div
                  className="w-full grid grid-cols-3 gap-6"
                  key={idComponent}
                >
                  {data.Arrange.map((item, idArrange) => (
                    <div
                      key={idArrange}
                      className="w-full grid grid-cols-4 grid-flow-col"
                    >
                      <div className="w-full h-full p-1 border-t border-l border-b rounded-l-md border-yellow-400 col-span-3 flex justify-center items-center">
                        <span>{item.Content}</span>
                      </div>
                      <input
                        type="number"
                        name={`${data.Name}_${idArrange + 1}`}
                        className="outline-none text-center border rounded-r-md bg-yellow-400 text-white border-yellow-400"
                      />
                    </div>
                  ))}
                </div>
              ) : data.type === 'stack' ? (
                <div
                  id={data.Name}
                  className="w-full flex flex-col space-y-4"
                  key={idComponent}
                >
                  <StackDrag data={data} idComponent={idComponent} />
                </div>
              ) : data.__component === 'editor.audio' ? (
                <div className="w-full" key={idComponent}>
                  <audio
                    controls
                    src={data.Audio.data.attributes.url}
                    className="outline-none"
                  >
                    Your browser does not support the
                    <code>audio</code> element.
                  </audio>
                </div>
              ) : data.type === 'stack-with-drag-drop' ? (
                <div className="flex flex-col w-full" key={idComponent}>
                  <StackDragDrop dragDrop={data} idComponent={idComponent} />
                </div>
              ) : (
                <></>
              ),
            )}
          </div>
          <div className="w-full my-10 max-w-4xl flex flex-col items-center mx-auto">
            <div className="border-b w-full pb-2">
              <span className="font-medium border-b border-black pb-2.5">
                Comments
              </span>
            </div>
            <div className="flex flex-col w-full space-y-6">
              {comments.map((data, id) => (
                <div key={id} className="w-full border-b pb-6 flex mt-10">
                  <span className="h-[fit-content] w-10 py-2 px-3 mr-5 text-white bg-yellow-400 font-medium">
                    {
                      userList
                        .find(
                          (item) =>
                            item.id.toString() === data.attributes.idUser,
                        )
                        .Full_Name.split('')[0]
                    }
                  </span>
                  <div className="w-full flex flex-col">
                    <div className="flex justify-between">
                      <span className="mb-2 font-medium">
                        {
                          userList.find(
                            (item) =>
                              item.id.toString() === data.attributes.idUser,
                          ).Full_Name
                        }
                      </span>
                      <span className="text-gray-500">
                        {`${new Date(
                          data.attributes.publishedAt,
                        ).getFullYear()}-${
                          new Date(data.attributes.publishedAt).getMonth() + 1
                        }-${new Date(data.attributes.publishedAt).getDate()}`}
                      </span>
                    </div>
                    <div className="w-full h-full">
                      <p>{data.attributes.Content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </Layout>
  )
}

export async function getServerSideProps(ctx) {
  const req = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/moduls?filters[id][$eq]=${ctx.params.slug}&populate=deep`,
  )
  const res = await req.json()

  const countdownData = (date) => {
    let today = new Date().toISOString().slice(0, 10)

    const startDate = date
    const endDate = today

    const diffInMs = new Date(startDate) - new Date(endDate)
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
    return diffInDays
  }

  if (res.data[0].attributes.major.data?.attributes.Name) {
    if (
      !res.data[0].attributes.major.data?.attributes.Name ===
      user.data.major.Name
    ) {
      return {
        notFound: true,
      }
    } else {
      if (countdownData(res.data[0].attributes.Assignment_Deadline) < 0) {
        return {
          notFound: true,
        }
      }
    }
  } else {
    return {
      notFound: true,
    }
  }

  const userList = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users`
  )

  const comments = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/comments?filters[idModul][$eq]=${res.data[0].id}&populate=deep`
  )

  const reqSeo = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/setting?populate=deep`,
  )
  const seo = await reqSeo.json()

  res.data[0].attributes.Editor = res.data[0].attributes.Editor.map(
    (data, id) => {
      if (
        data.__component === 'editor.drag-and-drop' ||
        data.type === 'stack-with-drag-drop'
      ) {
        return {
          ...data,
          Drop: data.Drop.map((item) => {
            return {
              id: item.id,
              Name: item.Name,
              Content: data.Drop.filter(
                (i) => i.Name === item.Name,
              ).map((k) => ({ Answer: k.Answer, Content: k.Content })),
            }
          }).reduce((unique, o) => {
            if (!unique.some((obj) => obj.Name === o.Name)) {
              unique.push(o)
            }
            return unique
          }, []),
        }
      } else {
        return data
      }
    },
  )

  const completed = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/completeds?filters[idUser][$eq]=${user.data.id}&populate=deep`
  )

  if (
    completed.data.data.find(
      (data) =>
        parseInt(data.attributes.idModul) === parseInt(res.data[0].id) &&
        parseInt(data.attributes.idUser) === parseInt(user.data.id),
    )
  ) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      user: user.data,
      userList: userList.data,
      seo: seo.data.attributes,
      modul: res.data[0].attributes,
      comments: comments.data.data,
      modulId: res.data[0].id,
    },
  }
}
