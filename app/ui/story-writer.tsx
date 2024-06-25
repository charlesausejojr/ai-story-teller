'use client'

import { anonymous_pro } from './fonts';
import renderEventMessage from "@/lib/renderEventMessage";
import React, { useState } from 'react'
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Frame } from '@gptscript-ai/gptscript';

const storiesPath = "public/stories";

function StoryWriter() {
    const [story, setStory] = useState("");
    const [pages, setPages] = useState<number>();
    const [progress, setProgress] = useState("");
    const [runStarted, setRunStarted] = useState<boolean>(false);
    const [runFinished, setRunFinished] = useState<boolean | null>(null);
    const [currentTool, setCurrentTool] = useState("");
    const [events, setEvents] = useState<Frame[]>([]);

    async function runScript(){
        setRunStarted(true);
        setRunFinished(false);
        const response = await fetch('api/run-script', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({ story, pages, path: storiesPath}),
        });

        if (response.ok && response.body) {
            // Stream handling
            console.log("[SUCCESS] nyxify has started to stream story writing");
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            handleStream(reader, decoder);
        } else {
            setRunStarted(false);
            setRunFinished(true);
            console.error("[ERROR] nyxify has failed to stream story writing");
        }
    }

    async function handleStream(reader : ReadableStreamDefaultReader<Uint8Array>, decoder : TextDecoder) {
        // Stream management
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value, { stream : true });

            const eventData = chunk
                .split("\n\n")
                .filter((line) => line.startsWith("event :"))
                .map((line) => line.replace(/^event /, ""));

            eventData.forEach(data => {
                try {
                    const parsedData = JSON.parse(data);
                    if (parsedData.type === "callProgress") {
                        setProgress(
                            parsedData.output[parsedData.output.length-1].content
                        );
                        setCurrentTool(
                            parsedData.tool?.description || ""
                        );
                    } else if (parsedData.type === "callStart") {
                        setCurrentTool(
                            parsedData.tool?.description || ""
                        );
                    } else if (parsedData.type === "runFinish") {
                        setRunFinished(true);
                        setRunStarted(false);
                    } else {
                        setEvents((prevEvents) => [...prevEvents, parsedData]);
                    }
                } catch (error) {

                }
            });
        }
    }

    return (
        <div className="m-auto w-1/2 bg-transparent text-white outline-white">
            <Textarea 
                className="m-auto bg-transparent" 
                placeholder='Write a story about how Star Lord is more handsome than Thor...'
                onChange={(e) => setStory(e.target.value)}
            />
            <Select onValueChange={(value) => setPages(parseInt(value))}>
                <SelectTrigger className="mx-auto mt-3 bg-transparent">
                    <SelectValue placeholder="How many pages for the story?" />
                </SelectTrigger>
                <SelectContent className='bg-transparent'>
                    {Array.from({ length: 10 }, (_, i) => (
                        <SelectItem className="bg-transparent text-white" key={i} value={String(i+1)}>{i + 1}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button
                disabled={!story || !pages}
                variant="outline"
                onClick={runScript}
                className='w-full bg-slate-300 text-black mt-3'
            >
                Generate
            </Button>

            <div 
                className='flex flex-col-reverse w-full space-y-2 pb-5 mt-5 bg-gray-800 rounded-md text-gray-200 font-mono p-10 h-[200px] overflow-y-scroll no-scrollbar'>
                    <div className={`${anonymous_pro.className}`}>
                        {runFinished === null && (
                            <>
                                <p className='mr-5 animate-pulse'>nyxify is waiting for you to begin story making...</p>
                                <br/>
                            </>
                        )}
                        <span className='mr-5'>{">>"}</span>
                        {progress}
                    </div>
                    {currentTool && (
                        <div className='py-10'>
                            <span className='mr-5'>{"=== [Current Tool] ==="}</span>

                        </div>
                    )}

                    <div className='space-y-5'>
                        {events.map((event, index) => (
                            <div key={index}>
                                <span className='mr-5'>{">>"}</span>
                                {renderEventMessage(event)}
                            </div>
                        ))}
                    </div>

                    {runStarted && (
                        <div>
                            <span className='mr-5 animate-in'>
                                {"--- [nyxify is brewing your story] ---"}
                            </span>
                        </div>
                    )}

            </div>
        </div>
    )
}

export default StoryWriter