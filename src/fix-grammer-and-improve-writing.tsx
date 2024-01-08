import { Action, ActionPanel, Detail, Toast, getSelectedText, preferences, showToast } from "@raycast/api";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { useEffect, useState } from 'react';

const model = new ChatOpenAI({
    temperature: 0.1,
    openAIApiKey: preferences.apiToken.value as string,
    modelName: preferences.model.value as string,
    frequencyPenalty: 0.5,
    streaming: true,
    configuration: {
        baseURL: preferences.baseURL.value as string,
    }
});

function ImproveWritingComponent() {
    const [improved, setImproved] = useState('');
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        async function improveWriting() {
            try {
                const text = await getSelectedText();
                setLoading(true)
                const response = await model.stream(`Please improve the grammar and authenticity of the following sentence, Return only the improved sentence without any explanations, tags, or quotes. For example, if given "I am good boys", you should return "I am a good boy. Now improve: ${text}"`);
                for await (const line of response) {
                    console.log(line.content.toString())
                    setImproved((prev) => prev + line.content.toString());
                }
                setLoading(false)
            } catch (error) {
                await showToast({
                    style: Toast.Style.Failure,
                    title: "Cannot improve writing",
                    message: String(error),
                });
            }
        }

        improveWriting();
    }, []);

    return (
        <Detail isLoading={loading} markdown={improved} actions={
            <ActionPanel title="#1 in raycast/extensions">
                <Action.CopyToClipboard title="Copy to Clipboard" content={improved} />
            </ActionPanel>
        }></Detail>
    )
}

export default ImproveWritingComponent;