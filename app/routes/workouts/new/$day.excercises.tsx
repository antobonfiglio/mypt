import type { LoaderFunction} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

const getData = ( query: String[] )=>{
    return new Promise((res, rej)=>{
        res([
            {
                id:1,
                excercise:'pushups'
            },{
                id:2,
                excercise:'squats'
            }
        ])
    })
}


export const loader: LoaderFunction = async ({
  request
}) => {
const url = new URL(request.url);
const brands = url.searchParams.getAll("brand");
return json(await getData(brands));
} 


export default function NewWourkoutExcercisesRoute(){
    return (
      <>
        Excercise 1
        <input type="hidden" name="excercise" value="1" />
      </>
    );
}