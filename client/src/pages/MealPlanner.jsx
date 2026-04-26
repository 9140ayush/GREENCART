import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const DIET_OPTIONS = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Diabetic-Friendly', 'Low-Calorie']
const DAY_OPTIONS = [3, 5, 7]
const PEOPLE_OPTIONS = [1, 2, 3, 4, 5, 6]

const MEALS = ['Breakfast', 'Lunch', 'Snack', 'Dinner']

const MealPlanner = () => {
  const { axios, navigate, addToCart, products } = useAppContext()
  const [step, setStep] = useState('form') // 'form' | 'loading' | 'result'
  const [diet, setDiet] = useState('Vegetarian')
  const [days, setDays] = useState(7)
  const [people, setPeople] = useState(2)
  const [mealPlan, setMealPlan] = useState(null)
  const [addedAll, setAddedAll] = useState(false)

  const generatePlan = async () => {
    setStep('loading')
    try {
      const { data } = await axios.post('/api/meal-planner', { diet, days, people })
      setMealPlan(data.mealPlan)
      setStep('result')
    } catch {
      // Fallback mock plan
      const mockPlan = Array.from({ length: days }, (_, dayIdx) => ({
        day: dayIdx + 1,
        meals: {
          Breakfast: { name: 'Oats with Banana & Honey', items: ['Oats', 'Banana', 'Honey'] },
          Lunch: { name: 'Dal Rice with Vegetable Sabzi', items: ['Basmati Rice', 'Dal', 'Mixed Vegetables'] },
          Snack: { name: 'Fruit Bowl', items: ['Apple', 'Orange', 'Grapes'] },
          Dinner: { name: 'Roti with Paneer Curry', items: ['Wheat Flour', 'Paneer', 'Tomato', 'Onion'] },
        }
      }))
      setMealPlan(mockPlan)
      setStep('result')
    }
  }

  const addAllToCart = () => {
    if (!mealPlan) return
    // Collect all unique ingredient names
    const allItems = new Set()
    mealPlan.forEach(day => {
      Object.values(day.meals).forEach(meal => {
        (meal.items || []).forEach(item => allItems.add(item.toLowerCase()))
      })
    })
    // Match against products
    let added = 0
    products.forEach(p => {
      if (allItems.has(p.name.toLowerCase()) || [...allItems].some(item => p.name.toLowerCase().includes(item))) {
        addToCart(p._id)
        added++
      }
    })
    toast.success(added > 0 ? `Added ${added} items to cart!` : 'No matching products found in store')
    setAddedAll(true)
  }

  return (
    <div style={{ paddingTop: '32px', paddingBottom: '80px', maxWidth: '900px', margin: '0 auto' }}>

      {/* Page Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: '#D8EDDE', color: '#3BB77E',
          padding: '5px 16px', borderRadius: '999px',
          fontSize: '12px', fontWeight: 700,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          marginBottom: '16px',
        }}>
          🤖 Powered by Gemini AI
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 4vw, 2.8rem)',
          fontWeight: 700, color: 'var(--text-heading)',
          margin: '0 0 12px', letterSpacing: '-0.025em',
        }}>
          Smart Meal Planner
        </h1>
        <p style={{ fontSize: '16px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Get a personalized weekly meal plan based on your dietary preferences, and shop all ingredients in one click.
        </p>
      </div>

      {step === 'form' && (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-main)',
          borderRadius: '24px', padding: 'clamp(24px, 4vw, 48px)',
        }}>
          {/* Diet Type */}
          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '14px' }}>Diet Type</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {DIET_OPTIONS.map(d => (
                <button key={d} onClick={() => setDiet(d)}
                  style={{
                    padding: '10px 20px',
                    border: `1.5px solid ${diet === d ? '#3BB77E' : 'var(--border-main)'}`,
                    background: diet === d ? '#3BB77E' : 'transparent',
                    color: diet === d ? '#fff' : 'var(--text-body)',
                    borderRadius: '999px', cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600, fontSize: '14px',
                    transition: 'all 0.2s',
                    boxShadow: diet === d ? '0 2px 12px rgba(59, 183, 126,0.25)' : 'none',
                  }}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Days */}
          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '14px' }}>Number of Days</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {DAY_OPTIONS.map(d => (
                <button key={d} onClick={() => setDays(d)}
                  style={{
                    width: '64px', height: '64px',
                    border: `1.5px solid ${days === d ? '#3BB77E' : 'var(--border-main)'}`,
                    background: days === d ? '#D8EDDE' : 'transparent',
                    color: days === d ? '#3BB77E' : 'var(--text-body)',
                    borderRadius: '16px', cursor: 'pointer',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700, fontSize: '20px',
                    transition: 'all 0.2s',
                  }}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* People */}
          <div style={{ marginBottom: '40px' }}>
            <p style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '14px' }}>Number of People</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {PEOPLE_OPTIONS.map(p => (
                <button key={p} onClick={() => setPeople(p)}
                  style={{
                    width: '52px', height: '52px',
                    border: `1.5px solid ${people === p ? '#3BB77E' : 'var(--border-main)'}`,
                    background: people === p ? '#D8EDDE' : 'transparent',
                    color: people === p ? '#3BB77E' : 'var(--text-body)',
                    borderRadius: '14px', cursor: 'pointer',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700, fontSize: '18px',
                    transition: 'all 0.2s',
                  }}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          <button onClick={generatePlan}
            style={{
              padding: '16px 40px',
              background: '#3BB77E', color: '#fff',
              border: 'none', borderRadius: '14px',
              fontFamily: 'var(--font-body)',
              fontWeight: 700, fontSize: '15px',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(59, 183, 126,0.30)',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}
            onMouseOver={e => { e.currentTarget.style.background = '#29A56C'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseOut={e => { e.currentTarget.style.background = '#3BB77E'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            🤖 Generate My {days}-Day Plan
          </button>
        </div>
      )}

      {step === 'loading' && (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px', animation: 'badgePulse 1.5s infinite' }}>🌿</div>
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-heading)', marginBottom: '8px' }}>
            Creating your personalized plan...
          </h3>
          <p style={{ color: 'var(--text-muted)' }}>Gemini AI is crafting the perfect {days}-day {diet} meal plan for {people} people.</p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '24px' }}>
            {[0, 0.2, 0.4].map((d, i) => (
              <div key={i} style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: '#3BB77E', animation: `badgePulse 1.2s ${d}s infinite`,
              }} />
            ))}
          </div>
        </div>
      )}

      {step === 'result' && mealPlan && (
        <div>
          {/* Summary */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '28px', flexWrap: 'wrap', gap: '16px',
          }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-heading)', margin: '0 0 4px', fontSize: '1.6rem' }}>
                Your {days}-Day {diet} Plan
              </h2>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>For {people} {people === 1 ? 'person' : 'people'}</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={() => setStep('form')}
                style={{
                  padding: '10px 20px', border: '1.5px solid var(--border-main)',
                  background: 'var(--bg-surface)', color: 'var(--text-body)',
                  borderRadius: '999px', cursor: 'pointer', fontWeight: 600, fontSize: '13px',
                }}>
                ← Regenerate
              </button>
              <button onClick={addAllToCart} disabled={addedAll}
                style={{
                  padding: '10px 24px',
                  background: addedAll ? '#29A56C' : '#3BB77E',
                  color: '#fff', border: 'none',
                  borderRadius: '999px', cursor: addedAll ? 'default' : 'pointer',
                  fontWeight: 700, fontSize: '13px',
                  boxShadow: '0 2px 12px rgba(59, 183, 126,0.25)',
                }}>
                {addedAll ? '✓ Added to Cart' : '🛒 Add All Ingredients to Cart'}
              </button>
            </div>
          </div>

          {/* Day Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {mealPlan.map((dayData, i) => (
              <div key={i} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-main)',
                borderRadius: '20px',
                overflow: 'hidden',
              }}>
                {/* Day Header */}
                <div style={{
                  background: 'linear-gradient(135deg, #3BB77E, #29A56C)',
                  color: '#fff', padding: '14px 24px',
                  fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '17px',
                }}>
                  Day {dayData.day}
                </div>
                {/* Meals Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                  gap: '1px',
                  background: 'var(--border-main)',
                }}>
                  {MEALS.map(mealType => {
                    const meal = dayData.meals?.[mealType];
                    if (!meal) return null;
                    return (
                      <div key={mealType} style={{
                        background: 'var(--bg-card)',
                        padding: '16px 20px',
                      }}>
                        <p style={{
                          fontSize: '10px', fontWeight: 700,
                          textTransform: 'uppercase', letterSpacing: '0.1em',
                          color: '#3BB77E', marginBottom: '6px',
                        }}>{mealType}</p>
                        <p style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-heading)', marginBottom: '8px', lineHeight: 1.4 }}>
                          {meal.name}
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {(meal.items || []).slice(0, 4).map(item => (
                            <span key={item} style={{
                              fontSize: '11px', padding: '2px 8px',
                              background: 'var(--bg-surface)',
                              border: '1px solid var(--border-soft)',
                              borderRadius: '999px', color: 'var(--text-muted)', fontWeight: 500,
                            }}>{item}</span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MealPlanner
