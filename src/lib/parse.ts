/**
 * Formats chat messages with enhanced readability features
 * Supports numbered steps, bullets, warnings, notes, and proper spacing
 * @param text Raw message text from server
 * @returns Formatted message text with improved readability
 */
export function formatChatMessage(text: string): string {
    if (!text) return '';

    try {
        // Split text into paragraphs while preserving meaningful whitespace
        let paragraphs = text.split('\n').map(p => p.trim()).filter(Boolean);
        let formattedText = '';

        // Track if we're in a list context
        let inNumberedList = false;
        let inBulletList = false;

        // Process each paragraph
        for (let i = 0; i < paragraphs.length; i++) {
            let paragraph = paragraphs[i];

            // Handle numbered steps with titles
            if (paragraph.match(/^\d+\.\s+\*\*([^*]+)\*\*/)) {
                const stepMatch = paragraph.match(/(\d+)\.\s+\*\*([^*]+)\*\*:?\s*([^]*)/);
                if (stepMatch) {
                    const [_, number, title, description] = stepMatch;

                    // Add extra spacing before first list item
                    if (!inNumberedList) {
                        formattedText += '\n';
                        inNumberedList = true;
                    }

                    formattedText += `${number}. ${title.toUpperCase()}\n`;
                    if (description) {
                        formattedText += `   ${description.trim()}\n\n`;
                    }
                }
                continue;
            }

            // Handle bullet points
            if (paragraph.match(/^[-•*]\s/)) {
                if (!inBulletList) {
                    formattedText += '\n';
                    inBulletList = true;
                }
                formattedText += `${paragraph}\n`;
                continue;
            }

            // Reset list tracking when we exit list context
            inNumberedList = false;
            inBulletList = false;

            // Handle warnings and important notes
            if (paragraph.match(/^(!+|WARNING|IMPORTANT|NOTE):/i)) {
                formattedText += `\n⚠️ ${paragraph}\n\n`;
                continue;
            }

            // Handle greetings and introductory phrases
            if (i === 0 && paragraph.match(/(?:sorry|hear|hello|hi|hey|greetings)/i)) {
                formattedText += `${paragraph}\n\n`;
                continue;
            }

            // Handle instruction lead-ins
            if (paragraph.match(/(?:follow these steps|please|following steps|instructions):/i)) {
                formattedText += `${paragraph}\n`;
                continue;
            }

            // Format remaining paragraphs with proper spacing
            if (paragraph.length > 100) {
                // Add line breaks for long paragraphs for better readability
                const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [paragraph];
                formattedText += sentences.join('\n') + '\n\n';
            } else {
                formattedText += `${paragraph}\n\n`;
            }
        }

        // Clean up formatting
        return formattedText
            .replace(/\n{3,}/g, '\n\n')  // Remove excessive newlines
            .replace(/\s+$/gm, '')       // Remove trailing spaces
            .trim();

    } catch (error) {
        console.error('Error formatting message:', error);
        return text;
    }
}

// Example usage with various formatting:
/*
const message = `Hello! I hope you're doing well.
Please follow these important safety instructions:
 
1. **Check Your Location**: Make sure you are in a safe area away from any immediate danger.
2. **Gather Supplies**: Get these essential items:
- Water bottles
- First aid kit
- Flashlight
- Battery-powered radio
 
WARNING: Do not attempt to cross flowing water!
 
3. **Stay Informed**: Keep monitoring official channels for updates.
• Download emergency alert apps
• Follow local authorities on social media
• Keep your phone charged
 
NOTE: If you need immediate assistance, please call emergency services.
 
Stay safe and keep in touch with your loved ones. We will provide more updates as the situation develops.`;
 
const formatted = formatChatMessage(message);
console.log(formatted);
*/