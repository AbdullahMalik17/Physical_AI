# ChatRAG Usage Allowance Feature

## Overview

The ChatRAG component now includes a **usage allowance system** that limits the number of questions users can ask per session or per day. This feature helps manage API costs, prevent abuse, and encourage thoughtful engagement with the learning material.

---

## Features

### 1. **Configurable Message Limits**
- Set a maximum number of messages per session or per day
- Flexible limit configuration per chapter or globally
- Visual feedback of remaining messages

### 2. **Dual Reset Modes**

#### Session-Based (Default)
- Limit resets when the page is refreshed
- Simple implementation, no storage required
- Best for: Development, testing, demos

#### Daily Reset (localStorage)
- Limit resets at midnight each day
- Persists across page refreshes and browser sessions
- Uses browser localStorage for tracking
- Best for: Production, cost management

### 3. **User Experience**
- **Real-time counter**: Shows remaining messages with color coding
  - 🟢 Green: 80%+ remaining
  - 🟡 Yellow: 20-80% remaining
  - 🔴 Red: Limit reached
- **Disabled state**: Input and button disabled when limit reached
- **Clear messaging**: Friendly notifications about limits and resets
- **Graceful degradation**: Works without localStorage (session mode)

---

## Usage

### Basic Implementation

```tsx
import ChatRAG from '@site/src/components/ChatRAG';

<ChatRAG
  context="your context here"
  placeholder="Ask a question..."
  messageLimit={10}
/>
```

### With Daily Reset

```tsx
<ChatRAG
  context="sensors, robotics, AI"
  placeholder="Ask about sensors..."
  messageLimit={10}
  resetLimitDaily={true}
/>
```

### Without Limits (Unlimited)

```tsx
<ChatRAG
  context="robotics"
  placeholder="Ask anything..."
  // No messageLimit prop = unlimited messages
/>
```

---

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `context` | `string` | `undefined` | Context for RAG retrieval |
| `placeholder` | `string` | `"Ask a question..."` | Input placeholder text |
| `useRealAPI` | `boolean` | `true` | Use real API or fallback mode |
| `messageLimit` | `number` | `undefined` | Max messages (undefined = unlimited) |
| `resetLimitDaily` | `boolean` | `false` | Reset limit daily vs. per session |

---

## Examples

### Example 1: Free Tier (10 questions/day)

**Use Case:** Open educational content with API cost management

```tsx
<ChatRAG
  context="chapter 1: embodied intelligence"
  placeholder="Ask about embodied AI..."
  useRealAPI={true}
  messageLimit={10}
  resetLimitDaily={true}
/>
```

**User Experience:**
- Users get 10 questions per day
- Counter shows: "💬 7 / 10 today"
- At limit: "⚠️ You've reached your message limit (10 questions for today). Come back tomorrow for more questions!"

### Example 2: Pro Tier (50 questions/session)

**Use Case:** Premium content or intensive learning sessions

```tsx
<ChatRAG
  context="advanced robotics"
  messageLimit={50}
  resetLimitDaily={false}
/>
```

**User Experience:**
- 50 questions per session
- Resets on page refresh
- Good for deep dives into specific topics

### Example 3: Unlimited (No Restrictions)

**Use Case:** Internal documentation, development, or premium subscriptions

```tsx
<ChatRAG
  context="internal docs"
  useRealAPI={true}
/>
```

**User Experience:**
- No limit counter shown
- Full access to chatbot
- Suitable for paid tiers or low-cost APIs

---

## Implementation Details

### localStorage Keys

The component uses two localStorage keys (when `resetLimitDaily={true}`):

1. **`chatrag_usage`**: Current message count
2. **`chatrag_usage_date`**: Date of last usage (format: `Date.toDateString()`)

### Reset Logic

```typescript
// Check if it's a new day
const today = new Date().toDateString();
const storedDate = localStorage.getItem('chatrag_usage_date');

if (storedDate !== today) {
  // Reset counter for new day
  localStorage.setItem('chatrag_usage', '0');
  localStorage.setItem('chatrag_usage_date', today);
}
```

### Message Counter Logic

```typescript
// Increment on each user message
const newCount = messageCount + 1;
setMessageCount(newCount);

if (resetLimitDaily) {
  localStorage.setItem('chatrag_usage', newCount.toString());
}

// Check limit before sending
if (messageLimit && messageCount >= messageLimit) {
  // Show limit reached message
  return;
}
```

---

## Visual Indicators

### Message Counter Display

```
💬 7 / 10 today
```

**Color Coding:**
- **Green** (0-80% used): Plenty of questions remaining
- **Yellow** (80-100% used): Running low
- **Red** (100% used): Limit reached

### Button States

| State | Button Text | Enabled |
|-------|-------------|---------|
| Normal | "Send" | ✅ |
| Loading | "Thinking..." | ❌ |
| Limit Reached | "Limit Reached" | ❌ |

### Placeholder Text

- Normal: `"Ask a question about this chapter..."`
- At Limit: `"Limit reached (10 messages)"`

---

## Cost Management

### API Cost Estimation

**OpenAI GPT-3.5 Turbo:**
- Input: $0.0005 per 1K tokens
- Output: $0.0015 per 1K tokens
- Average query: ~500 input + 300 output = ~$0.0007

**With 10 messages/day limit:**
- 100 users × 10 messages = 1,000 messages/day
- Cost: 1,000 × $0.0007 = **$0.70/day** (~$21/month)

**Without limits (100 users, 50 messages/day avg):**
- 100 users × 50 messages = 5,000 messages/day
- Cost: 5,000 × $0.0007 = **$3.50/day** (~$105/month)

**Savings: 80% reduction in API costs**

---

## Best Practices

### 1. **Set Appropriate Limits**

| User Type | Recommended Limit | Reset Mode |
|-----------|------------------|------------|
| Free users | 5-10 | Daily |
| Students | 20-30 | Daily |
| Premium | 50-100 | Session |
| Enterprise | Unlimited | N/A |

### 2. **Progressive Disclosure**

Start with lower limits and increase based on engagement:

```tsx
// Week 1: 5 questions/day
<ChatRAG messageLimit={5} resetLimitDaily={true} />

// Week 2+: 10 questions/day
<ChatRAG messageLimit={10} resetLimitDaily={true} />
```

### 3. **Per-Chapter Limits**

Different chapters may warrant different limits:

```tsx
// Intro chapter: Lower limit
<ChatRAG messageLimit={5} />

// Advanced chapter: Higher limit
<ChatRAG messageLimit={20} />
```

### 4. **Analytics Integration**

Track usage to optimize limits:

```typescript
// Log when users hit limits
if (messageCount === messageLimit) {
  analytics.track('chatbot_limit_reached', {
    chapter: context,
    limit: messageLimit,
  });
}
```

---

## Troubleshooting

### Issue: Limit not resetting daily

**Cause:** Browser localStorage disabled or blocked

**Solution:**
```tsx
// Check localStorage availability
if (typeof window !== 'undefined' && window.localStorage) {
  // localStorage available
} else {
  // Fallback to session mode
}
```

### Issue: Counter not updating

**Cause:** React state not syncing with localStorage

**Solution:** The component automatically syncs on mount and after each message. If issues persist, clear localStorage:

```javascript
// In browser console
localStorage.removeItem('chatrag_usage');
localStorage.removeItem('chatrag_usage_date');
```

### Issue: Different limits on same day

**Cause:** Multiple localStorage keys (one per component instance)

**Solution:** Currently, all ChatRAG instances share the same counter. To have per-chapter limits:

```tsx
// Add chapter-specific key
const STORAGE_KEY = `chatrag_usage_${context}`;
```

---

## Accessibility

The allowance system is fully accessible:

- ✅ **Screen readers**: All status updates announced
- ✅ **Keyboard navigation**: Tab through controls
- ✅ **Visual indicators**: Color + text (not color-only)
- ✅ **Error states**: Clear messaging when limit reached

---

## Future Enhancements

### Planned Features

1. **User Authentication Integration**
   ```tsx
   <ChatRAG
     userId={currentUser.id}
     messageLimit={currentUser.plan.messageLimit}
   />
   ```

2. **Backend Tracking**
   - Server-side enforcement
   - Analytics dashboard
   - Rate limiting by IP

3. **Dynamic Limits**
   ```tsx
   <ChatRAG
     messageLimit={isPremium ? 100 : 10}
     autoUpgrade={true}  // Prompt for upgrade at limit
   />
   ```

4. **Usage Stats**
   ```tsx
   <ChatRAG
     showUsageStats={true}  // Display daily/weekly stats
   />
   ```

---

## Migration Guide

### From Old Chat Component

**Before:**
```tsx
import Chat from '@site/src/components/Chat';

<Chat context="robotics" />
```

**After:**
```tsx
import ChatRAG from '@site/src/components/ChatRAG';

<ChatRAG
  context="robotics"
  messageLimit={10}
  resetLimitDaily={true}
/>
```

**Breaking Changes:** None! ChatRAG is backward compatible—just omit `messageLimit` for unlimited mode.

---

## Testing

### Manual Testing Checklist

- [ ] Message counter displays correctly
- [ ] Counter updates after each message
- [ ] Input disabled at limit
- [ ] Button shows "Limit Reached"
- [ ] Warning message appears at limit
- [ ] Daily reset works (change system date)
- [ ] Session reset works (refresh page)
- [ ] localStorage persistence works
- [ ] Unlimited mode works (no limit set)

### Automated Testing

```typescript
describe('ChatRAG Allowance', () => {
  it('should track message count', () => {
    const { getByText, getByPlaceholderText } = render(
      <ChatRAG messageLimit={3} />
    );

    // Send 3 messages
    for (let i = 0; i < 3; i++) {
      fireEvent.change(getByPlaceholderText(/Ask/), {
        target: { value: 'Test' },
      });
      fireEvent.click(getByText('Send'));
    }

    // Check limit reached
    expect(getByText('Limit Reached')).toBeInTheDocument();
  });
});
```

---

## Summary

The ChatRAG usage allowance system provides:

✅ **Cost Control**: Reduce API costs by 80%+
✅ **Flexible Limits**: Per-session or daily reset
✅ **Great UX**: Clear visual feedback and messaging
✅ **Easy Integration**: Drop-in replacement for Chat component
✅ **Privacy-Friendly**: Client-side tracking with localStorage
✅ **Scalable**: Ready for backend integration

**Result:** A sustainable, user-friendly chatbot that manages costs while providing excellent learning support.

---

## Support

For questions or issues:
- GitHub Issues: [Physical AI Platform](https://github.com/yourusername/physical-ai)
- Documentation: See [RAG_SETUP.md](./RAG_SETUP.md)
- Examples: Check chapter implementations in `docs/part1-fundamentals/`
