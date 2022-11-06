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

export default function PreviewModul({ userList, modul, seo, comments }) {

  const updateSize = (name) => {
    const span = document.getElementsByName(name)
    const input = document.getElementsByName(name)
    span[0].innerText = input[1].value
    input[1].value = ''
  }

  const updateSizeChange = (name) => {
    const span = document.getElementsByName(name)
    const input = document.getElementsByName(name)
    span[0].innerText = `${input[1].value}`
  }

  const doChangeInput = (e, name) => {
    const input = document.getElementsByName(name)
    input[1].oninput = updateSizeChange(name)

    // Provide some initial content
    input[1].value = e.target.value.replace(/\s/g, '')
    updateSizeChange(name)
  }

  useEffect(() => {
    modul.Editor?.filter((data) => data.type === 'essay').forEach((data) => {
      data.Question.forEach((item) => {
        item.Content.forEach((i, idAnswer) => {
          if (i.Answer) {
            const input = document.getElementsByName(
              `${data.Name}_${item.Name}_${idAnswer + 1}`,
            )
            input[1].oninput = updateSize(
              `${data.Name}_${item.Name}_${idAnswer + 1}`,
            )

            // Provide some initial content
            input[1].value = '...............'
            updateSize(`${data.Name}_${item.Name}_${idAnswer + 1}`)
          }
        })
      })
    })
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
          <div className="w-full max-w-4xl flex flex-col items-center mx-auto space-y-8">
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
                          className="w-full pl-3 py-1 border-t border-black placeholder:text-blue-800 text-blue-800 outline-none"
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
                          className="w-full pl-3 py-1 placeholder:text-blue-800 text-blue-800 outline-none"
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
                          className="w-full pl-3 py-1 border-t border-black placeholder:text-blue-800 text-blue-800 outline-none"
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
                          className="w-full pl-3 py-1 placeholder:text-blue-800 text-blue-800 outline-none"
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
                      <div className="w-full h-full p-1 border-t border-l border-b rounded-l-md border-blue-800 col-span-3 flex justify-center items-center">
                        <span>{item.Content}</span>
                      </div>
                      <input
                        type="number"
                        name={`${data.Name}_${idArrange + 1}`}
                        className="outline-none text-center border rounded-r-md bg-blue-800 text-white border-blue-800"
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
              ) : data.type === 'essay' ? (
                <div
                  className="flex flex-col w-full space-y-4"
                  key={idComponent}
                >
                  {data.Question.map((item, id) => (
                    <div className="w-full grid grid-cols-12" key={id}>
                      <div className="outline-none col-span-2 lg:col-span-1 rounded-l-md border border-blue-800 flex justify-center items-center">
                        <span>{id + 1}</span>
                      </div>
                      <div className="w-full h-full p-3 leading-loose col-span-10 lg:col-span-11 rounded-r-md border-t border-b border-r border-blue-800 bg-blue-800 text-white">
                        {item.Content.map((i, idAnswer) =>
                          !i.Answer ? (
                            <span
                              name={`${data.Name}_${item.Name}_${idAnswer + 1}`}
                              key={idAnswer}
                            >
                              {i.Content}
                            </span>
                          ) : (
                            <>
                              &nbsp;
                              <div className="relative inline-block min-w-[4em]">
                                <span
                                  name={`${data.Name}_${item.Name}_${
                                    idAnswer + 1
                                  }`}
                                  className="invisible whitespace-pre pl-3"
                                ></span>
                                <input
                                  name={`${data.Name}_${item.Name}_${
                                    idAnswer + 1
                                  }`}
                                  onChange={(e) =>
                                    doChangeInput(
                                      e,
                                      `${data.Name}_${item.Name}_${
                                        idAnswer + 1
                                      }`,
                                    )
                                  }
                                  placeholder="..............."
                                  maxLength="15"
                                  className={`absolute left-0 w-full text-blue-800 bg-white px-2 rounded-md outline-none placeholder:text-blue-800`}
                                />
                              </div>
                              &nbsp;
                            </>
                          ),
                        )}
                      </div>
                    </div>
                  ))}
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
                  <span className="h-[fit-content] w-10 py-2 px-3 mr-5 text-white bg-blue-800 font-medium">
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

  if (!res.data || res.data.length === 0) {
    return {
      notFound: true,
    }
  }

  const userList = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
  )

  const comments = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/comments?filters[idModule][$eq]=${res.data[0].id}&populate=deep`,
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
      } else if (data.type === 'essay') {
        return {
          ...data,
          Question: data.Question.map((item) => {
            return {
              id: item.id,
              Name: item.Name,
              Content: data.Question.filter(
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

  return {
    props: {
      userList: userList.data,
      seo: seo.data.attributes,
      modul: res.data[0].attributes,
      comments: comments.data.data,
      modulId: res.data[0].id,
    },
  }
}
